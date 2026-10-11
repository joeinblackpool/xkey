"""
Build XKey's free backlink index for EVERY domain from Common Crawl's domain-level web graph
(~133 million domains, ~2.1 billion links, refreshed quarterly).

For every domain that other websites link to, it records:
  - how many different websites (domains) link to it
  - its link strength (0-100: referring domains on a log scale, the most-linked domain = 100)
  - its strongest linking websites (up to TOP_K), each with their own link strength

Output (format 2), all in --out:
  bl-data-0.bin, bl-data-1.bin, … – gzipped text shards back to back (each file < 1.9 GB, GitHub's
                                    limit is 2 GB). A shard is "\\n" then lines of
                                    "domain\\tref_domains\\tstrength\\tlinker:strength,linker:strength,…\\n"
  bl-index.bin                    – SHARDS records of three little-endian uint32: file, offset, length
                                    (length 0 = no linked domains in that shard)
  manifest.json                   – release info, shard count, file names
A domain's shard is crc32(domain) % SHARDS; the Worker reads the index, then just that byte range of
one data file (~40 kB), so a lookup never downloads more than it needs.

Memory/time: the links are read once to count referring domains, then once per partition (shard %
PARTS), keeping only that partition's links, so it fits a 16 GB GitHub runner. ~2 hours on real data.

  python backlinks/build.py cc-main-2026-jul-aug-sep                                    # real data
  python backlinks/build.py RELEASE --base http://127.0.0.1:8899 --parts 2 --shards 64  # tests
"""
import argparse
import gzip
import json
import math
import os
import shutil
import subprocess
import time
import zlib

import numpy as np
import pandas as pd

TOP_K = 50
CHUNK = 20_000_000
MAX_FILE = 1_900_000_000


def log(msg):
    print(f"[{time.strftime('%H:%M:%S')}] {msg}", flush=True)


def shard_of(domain, shards):
    return zlib.crc32(domain.encode("ascii", "replace")) % shards


def read_tsv(url, names, dtypes, usecols=None):
    """Stream a gzipped TSV from url in chunks (curl | pigz), never touching the disk."""
    curl = subprocess.Popen(["curl", "-sSfL", "--retry", "20", "--retry-all-errors", "--retry-delay", "5", url], stdout=subprocess.PIPE)
    unzip = subprocess.Popen(["pigz" if shutil.which("pigz") else "gzip", "-dc"], stdin=curl.stdout, stdout=subprocess.PIPE)
    curl.stdout.close()
    reader = pd.read_csv(unzip.stdout, sep="\t", header=None, names=names, dtype=dtypes, usecols=usecols,
                         chunksize=CHUNK, comment="#", engine="c", na_filter=False, quoting=3)
    for chunk in reader:
        yield chunk
    unzip.wait()
    curl.wait()
    if curl.returncode or unzip.returncode:
        raise SystemExit(f"download failed for {url} (curl {curl.returncode}, unzip {unzip.returncode})")


class DataWriter:
    """Appends gzipped shards to bl-data-N.bin files, rolling over before GitHub's 2 GB asset limit."""
    def __init__(self, out, shards, max_file=MAX_FILE):
        self.out, self.file_no, self.fh, self.pos, self.max_file = out, -1, None, 0, max_file
        self.index = np.zeros((shards, 3), "<u4")
        self.files, self.total = [], 0
        self._next()

    def _next(self):
        if self.fh:
            self.fh.close()
        self.file_no += 1
        name = f"bl-data-{self.file_no}.bin"
        self.files.append(name)
        self.fh, self.pos = open(os.path.join(self.out, name), "wb"), 0

    def add(self, shard, text):
        blob = gzip.compress(text, compresslevel=6, mtime=0)
        if self.pos and self.pos + len(blob) > self.max_file:
            self._next()
        self.fh.write(blob)
        self.index[shard] = (self.file_no, self.pos, len(blob))
        self.pos += len(blob)
        self.total += len(blob)

    def close(self):
        self.fh.close()
        self.index.tofile(os.path.join(self.out, "bl-index.bin"))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("release")
    ap.add_argument("--base", default="https://data.commoncrawl.org/projects/hyperlinkgraph")
    ap.add_argument("--out", default="shards")
    ap.add_argument("--shards", type=int, default=131072)
    ap.add_argument("--parts", type=int, default=8)
    ap.add_argument("--max-file", type=int, default=MAX_FILE)
    a = ap.parse_args()
    S, P = a.shards, a.parts
    root = f"{a.base}/{a.release}/domain/{a.release}-domain"
    os.makedirs(a.out, exist_ok=True)
    t0 = time.time()

    # 1) Domain names (forward form, one bytes buffer + offsets) and each domain's shard.
    log("Reading domain list…")
    bufs, lens, shard_parts, n_nodes = [], [], [], 0
    for c in read_tsv(f"{root}-vertices.txt.gz", ["id", "rev", "hosts"], {"id": np.int64, "rev": str, "hosts": np.int64}, usecols=[0, 1]):
        if int(c["id"].iloc[0]) != n_nodes:
            raise SystemExit("vertex ids are not consecutive")
        raw = [".".join(reversed(r.split("."))).encode("ascii", "replace") for r in c["rev"].tolist()]
        bufs.append(b"".join(raw))
        lens.append(np.fromiter((len(x) for x in raw), np.int64, len(raw)))
        shard_parts.append(np.fromiter((zlib.crc32(x) % S for x in raw), np.int32, len(raw)))
        n_nodes += len(raw)
        log(f"  {n_nodes:,} domains")
    names = b"".join(bufs)
    del bufs
    offs = np.zeros(n_nodes + 1, np.int64)
    np.cumsum(np.concatenate(lens), out=offs[1:])
    del lens
    shard = np.concatenate(shard_parts)
    del shard_parts
    log(f"{n_nodes:,} domains, names use {len(names) / 1e9:.1f} GB")

    # 2) Referring domains for every domain (edges are unique domain pairs).
    log("Counting links (pass 1)…")
    indeg = np.zeros(n_nodes, np.int64)
    n_links = 0
    for c in read_tsv(f"{root}-edges.txt.gz", ["f", "t"], {"f": np.int32, "t": np.int32}):
        indeg += np.bincount(c["t"].to_numpy(), minlength=n_nodes)
        n_links += len(c)
    top = max(int(indeg.max()), 1)
    strength = np.round(100 * np.log1p(indeg) / math.log1p(top)).astype(np.int8)
    indeg = indeg.astype(np.int32)
    log(f"{n_links:,} links; {int((indeg > 0).sum()):,} domains have at least one; most-linked has {top:,}")

    sb = [str(i).encode() for i in range(101)]
    w = DataWriter(a.out, S, a.max_file)
    linked = 0

    # 3) One pass per partition: keep the links into this partition's shards, rank, write.
    for p in range(P):
        log(f"Partition {p + 1}/{P}: reading links…")
        fs, ts = [], []
        for c in read_tsv(f"{root}-edges.txt.gz", ["f", "t"], {"f": np.int32, "t": np.int32}):
            f, t = c["f"].to_numpy(), c["t"].to_numpy()
            m = (shard[t] % P) == p
            fs.append(f[m])
            ts.append(t[m])
        f = np.concatenate(fs) if fs else np.zeros(0, np.int32)
        t = np.concatenate(ts) if ts else np.zeros(0, np.int32)
        del fs, ts
        # sort by shard, then target, then strongest linker first
        key = shard[t].astype(np.int64) * n_nodes + t
        order = np.lexsort((-indeg[f], key))
        f, t, key = f[order], t[order], key[order]
        del order
        if len(t):
            starts = np.flatnonzero(np.r_[True, t[1:] != t[:-1]])
            pos = np.arange(len(t)) - np.repeat(starts, np.diff(np.r_[starts, len(t)]))
            keep = pos < TOP_K
            f, t, key = f[keep], t[keep], key[keep]
            del pos, keep, starts
        log(f"  {len(t):,} links kept after the top-{TOP_K} cap; writing shards…")
        row_shard = (key // n_nodes).astype(np.int32)
        del key
        bounds = np.flatnonzero(np.r_[True, row_shard[1:] != row_shard[:-1], True]) if len(t) else np.array([0])
        for j in range(len(bounds) - 1):
            a0, b0 = int(bounds[j]), int(bounds[j + 1])
            F, T = f[a0:b0], t[a0:b0]
            fa, fb, fsg = offs[F].tolist(), offs[F + 1].tolist(), strength[F].tolist()
            g = np.flatnonzero(np.r_[True, T[1:] != T[:-1], True])
            tgt = T[g[:-1]]
            ta, tb, tn, tsg = offs[tgt].tolist(), offs[tgt + 1].tolist(), indeg[tgt].tolist(), strength[tgt].tolist()
            g = g.tolist()
            lines = []
            for k in range(len(g) - 1):
                toks = [names[fa[i]:fb[i]] + b":" + sb[fsg[i]] for i in range(g[k], g[k + 1])]
                lines.append(names[ta[k]:tb[k]] + b"\t" + str(tn[k]).encode() + b"\t" + sb[tsg[k]] + b"\t" + b",".join(toks))
            linked += len(lines)
            w.add(int(row_shard[a0]), b"\n" + b"\n".join(lines) + b"\n")
        del f, t, row_shard
        log(f"  partition {p + 1} done: {linked:,} domains so far, {w.total / 1e9:.2f} GB written")

    w.close()
    manifest = {"format": 2, "scope": "all", "release": a.release, "built": time.strftime("%Y-%m-%d"),
                "shards": S, "top_k": TOP_K, "hash": "crc32", "files": w.files, "index": "bl-index.bin",
                "domains": linked, "all_domains": n_nodes, "links": n_links, "max_ref_domains": top}
    with open(os.path.join(a.out, "manifest.json"), "w") as fh:
        json.dump(manifest, fh, indent=1)
    log(f"Done in {(time.time() - t0) / 60:.1f} min: {linked:,} linked domains, {w.total / 1e9:.2f} GB in {len(w.files)} data file(s)")


if __name__ == "__main__":
    main()
