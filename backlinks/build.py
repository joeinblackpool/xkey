"""
Build XKey's free UK backlink index from Common Crawl's domain-level web graph.

For every .uk domain that other websites link to, it records:
  - how many different websites (domains) link to it
  - its link strength (0-100, from how many websites link to it, on a log scale)
  - its strongest linking websites (up to TOP_K), each with their own link strength

Output: shards/bl-000.json.gz ... bl-511.json.gz and shards/manifest.json.
Each shard is {"example.co.uk": [ref_domains, strength, [["linker.com", strength], ...]], ...}.
A domain's shard is fnv1a32(domain) % SHARDS (the Worker uses the same function).

Runs on a GitHub Actions runner (see .github/workflows/backlinks.yml): the files are streamed
straight from Common Crawl, so nothing big is written to disk.

  python backlinks/build.py cc-main-2026-jul-aug-sep            # real data
  python backlinks/build.py RELEASE --base http://127.0.0.1:8899  # test data
"""
import argparse
import gzip
import json
import math
import os
import shutil
import subprocess
import sys
import time

import numpy as np
import pandas as pd

SHARDS = 512
TOP_K = 100
CHUNK = 20_000_000
UK_SECOND_LEVEL = {"co", "org", "ltd", "plc", "net", "me", "ac", "gov", "nhs", "police", "sch", "mod", "nic", "parliament"}


def log(msg):
    print(f"[{time.strftime('%H:%M:%S')}] {msg}", flush=True)


def fnv1a32(s):
    h = 2166136261
    for b in s.encode("utf-8"):
        h ^= b
        h = (h * 16777619) & 0xFFFFFFFF
    return h


def forward(rev):
    """'uk.co.example' -> 'example.co.uk'"""
    return ".".join(reversed(rev.split(".")))


def stream(url):
    """A text stream of a gzipped file at url, decompressed on the fly (curl | pigz)."""
    curl = subprocess.Popen(["curl", "-sSfL", "--retry", "20", "--retry-all-errors", "--retry-delay", "5", url],
                            stdout=subprocess.PIPE)
    unzip = subprocess.Popen(["pigz" if shutil.which("pigz") else "gzip", "-dc"], stdin=curl.stdout, stdout=subprocess.PIPE)
    curl.stdout.close()
    return unzip, curl


def read_tsv(url, names, dtypes, usecols=None):
    unzip, curl = stream(url)
    reader = pd.read_csv(unzip.stdout, sep="\t", header=None, names=names, dtype=dtypes, usecols=usecols,
                         chunksize=CHUNK, comment="#", engine="c", na_filter=False, quoting=3)
    for chunk in reader:
        yield chunk
    unzip.wait()
    curl.wait()
    if curl.returncode or unzip.returncode:
        raise SystemExit(f"download failed for {url} (curl {curl.returncode}, unzip {unzip.returncode})")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("release")
    ap.add_argument("--base", default="https://data.commoncrawl.org/projects/hyperlinkgraph")
    ap.add_argument("--out", default="shards")
    a = ap.parse_args()
    root = f"{a.base}/{a.release}/domain/{a.release}-domain"
    os.makedirs(a.out, exist_ok=True)
    t0 = time.time()

    # 1) Vertices: total count and which ids are .uk domains.
    log("Reading domain list…")
    n_nodes, uk_ids, uk_names = 0, [], []
    for c in read_tsv(f"{root}-vertices.txt.gz", ["id", "rev", "hosts"], {"id": np.int64, "rev": str, "hosts": np.int64}, usecols=[0, 1]):
        n_nodes = max(n_nodes, int(c["id"].iloc[-1]) + 1)
        m = c["rev"].str.startswith("uk.")
        uk_ids.append(c["id"][m].to_numpy(np.int64))
        uk_names.extend(c["rev"][m].tolist())
    uk_ids = np.concatenate(uk_ids) if uk_ids else np.zeros(0, np.int64)
    uk_mask = np.zeros(n_nodes, bool)
    uk_mask[uk_ids] = True
    log(f"{n_nodes:,} domains, {len(uk_ids):,} are .uk")

    # 2) Edges: in-degree of every domain, and keep the links that point at .uk domains.
    log("Reading links (this is the big one)…")
    indeg = np.zeros(n_nodes, np.int64)
    kept_from, kept_to, seen = [], [], 0
    for c in read_tsv(f"{root}-edges.txt.gz", ["f", "t"], {"f": np.int64, "t": np.int64}):
        f, t = c["f"].to_numpy(), c["t"].to_numpy()
        indeg += np.bincount(t, minlength=n_nodes)
        m = uk_mask[t]
        kept_from.append(f[m].astype(np.int32))
        kept_to.append(t[m].astype(np.int32))
        seen += len(t)
        if seen % (CHUNK * 10) == 0:
            log(f"  {seen:,} links read")
    f = np.concatenate(kept_from) if kept_from else np.zeros(0, np.int32)
    t = np.concatenate(kept_to) if kept_to else np.zeros(0, np.int32)
    del kept_from, kept_to
    log(f"{seen:,} links read, {len(t):,} point at .uk domains")

    # Link strength 0-100: log of referring domains, scaled to the most-linked domain on the web.
    top = max(int(indeg.max()), 1)
    def strength(x):
        return np.round(100 * np.log1p(x) / math.log1p(top)).astype(np.int16)

    # 3) Strongest linkers per .uk domain: sort by (target, -linker in-degree), keep the first TOP_K.
    order = np.lexsort((-indeg[f], t))
    f, t = f[order], t[order]
    starts = np.flatnonzero(np.r_[True, t[1:] != t[:-1]]) if len(t) else np.zeros(0, np.int64)
    counts = np.diff(np.r_[starts, len(t)])
    pos = np.arange(len(t)) - np.repeat(starts, counts)
    keep = pos < TOP_K
    f_top, t_top = f[keep], t[keep]
    need = np.unique(f_top)
    log(f"{len(starts):,} .uk domains have links; looking up names for {len(need):,} linking domains")

    # 4) Names for the linking domains.
    need_mask = np.zeros(n_nodes, bool)
    need_mask[need] = True
    names = {}
    for c in read_tsv(f"{root}-vertices.txt.gz", ["id", "rev", "hosts"], {"id": np.int64, "rev": str, "hosts": np.int64}, usecols=[0, 1]):
        m = need_mask[c["id"].to_numpy()]
        names.update(zip(c["id"][m].tolist(), c["rev"][m].tolist()))
    uk_name = dict(zip(uk_ids.tolist(), uk_names))

    # 5) Write shards.
    log("Writing shards…")
    shards = [dict() for _ in range(SHARDS)]
    s_all = strength(indeg)
    top_starts = np.flatnonzero(np.r_[True, t_top[1:] != t_top[:-1]]) if len(t_top) else np.zeros(0, np.int64)
    top_ends = np.r_[top_starts[1:], len(t_top)]
    for tgt, n, a0, b0 in zip(t_top[top_starts].tolist(), counts.tolist(), top_starts.tolist(), top_ends.tolist()):
        dom = forward(uk_name[tgt])
        linkers = [[forward(names[x]), int(s_all[x])] for x in f_top[a0:b0].tolist()]
        shards[fnv1a32(dom) % SHARDS][dom] = [int(n), int(s_all[tgt]), linkers]
    total = 0
    for i, sh in enumerate(shards):
        total += len(sh)
        with gzip.open(os.path.join(a.out, f"bl-{i:03d}.json.gz"), "wt", encoding="utf-8", compresslevel=9) as fh:
            json.dump(sh, fh, separators=(",", ":"), ensure_ascii=False)
    manifest = {"release": a.release, "built": time.strftime("%Y-%m-%d"), "shards": SHARDS, "top_k": TOP_K,
                "domains": total, "uk_domains": int(len(uk_ids)), "all_domains": int(n_nodes), "links": int(seen),
                "max_ref_domains": top}
    with open(os.path.join(a.out, "manifest.json"), "w") as fh:
        json.dump(manifest, fh, indent=1)
    size = sum(os.path.getsize(os.path.join(a.out, x)) for x in os.listdir(a.out))
    log(f"Done in {(time.time() - t0) / 60:.1f} min: {total:,} domains, {size / 1e6:.1f} MB in {SHARDS} shards")


if __name__ == "__main__":
    main()
