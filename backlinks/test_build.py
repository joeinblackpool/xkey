"""Offline test for build.py: a tiny fake web graph with known answers.  Run: python backlinks/test_build.py"""
import gzip, json, os, subprocess, sys, tempfile, threading, unittest, zlib
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from functools import partial

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
REL, SHARDS = "cc-test", 64
DOMAINS = ["com.bigsite", "uk.co.bbc", "uk.co.smithplumbing", "uk.org.charity", "com.blog", "uk.co.rival", "org.wikipedia", "uk.lonely", "com.example"]
LINKS = [("com.bigsite", "uk.co.smithplumbing"), ("uk.co.bbc", "uk.co.smithplumbing"), ("com.blog", "uk.co.smithplumbing"),
         ("org.wikipedia", "uk.co.bbc"), ("com.bigsite", "uk.co.bbc"), ("com.blog", "uk.co.bbc"), ("uk.org.charity", "uk.co.bbc"),
         ("org.wikipedia", "com.bigsite"), ("uk.co.bbc", "com.bigsite"), ("com.blog", "com.bigsite"),
         ("org.wikipedia", "uk.co.rival"), ("com.blog", "uk.co.rival"), ("uk.co.bbc", "org.wikipedia"), ("uk.co.bbc", "com.example")]


def read_index(out):
    m = json.load(open(os.path.join(out, "manifest.json")))
    idx = np.fromfile(os.path.join(out, m["index"]), "<u4").reshape(-1, 3)
    data = {}
    for i, (f, off, n) in enumerate(idx.tolist()):
        if not n:
            continue
        with open(os.path.join(out, m["files"][f]), "rb") as fh:
            fh.seek(off)
            text = gzip.decompress(fh.read(n)).decode()
        assert text.startswith("\n")
        for line in text.strip("\n").split("\n"):
            dom, n_ref, s, linkers = line.split("\t")
            assert zlib.crc32(dom.encode()) % m["shards"] == i, "domain in the wrong shard"
            data[dom] = (int(n_ref), int(s), [(x.rsplit(":", 1)[0], int(x.rsplit(":", 1)[1])) for x in linkers.split(",")])
    return m, data


class BuildTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.mkdtemp()
        d = os.path.join(cls.tmp, REL, "domain"); os.makedirs(d)
        ids = {n: i for i, n in enumerate(DOMAINS)}
        with gzip.open(os.path.join(d, f"{REL}-domain-vertices.txt.gz"), "wt") as f:
            for n, i in ids.items(): f.write(f"{i}\t{n}\t1\n")
        with gzip.open(os.path.join(d, f"{REL}-domain-edges.txt.gz"), "wt") as f:
            for a, b in sorted(LINKS, key=lambda x: (ids[x[0]], ids[x[1]])): f.write(f"{ids[a]}\t{ids[b]}\n")
        srv = ThreadingHTTPServer(("127.0.0.1", 0), partial(SimpleHTTPRequestHandler, directory=cls.tmp))
        srv.RequestHandlerClass.log_message = lambda *a: None
        threading.Thread(target=srv.serve_forever, daemon=True).start()
        def build(out, *extra):
            # tiny --max-file forces several data files, to test the 2 GB roll-over logic
            subprocess.run([sys.executable, os.path.join(HERE, "build.py"), REL, "--base", f"http://127.0.0.1:{srv.server_address[1]}",
                            "--out", out, "--shards", str(SHARDS), "--parts", "2", "--max-file", "120", *extra], check=True)
            return read_index(out)
        cls.spill = os.path.join(cls.tmp, "spill")
        cls.manifest, cls.data = build(os.path.join(cls.tmp, "shards"), "--spill", cls.spill, "--workers", "2")
        cls.manifest2, cls.data2 = build(os.path.join(cls.tmp, "shards2"), "--workers", "1")

    def test_counts_and_order(self):
        n, s, linkers = self.data["smithplumbing.co.uk"]
        self.assertEqual(n, 3)
        names = [x[0] for x in linkers]
        self.assertEqual(set(names), {"bigsite.com", "bbc.co.uk", "blog.com"})
        self.assertEqual(names[:2], ["bbc.co.uk", "bigsite.com"], "strongest linkers first (bbc has 4 linkers, bigsite 3, blog 0)")
        self.assertEqual([x[1] for x in linkers], sorted([x[1] for x in linkers], reverse=True))

    def test_all_domains_included(self):
        self.assertEqual(set(self.data), {"smithplumbing.co.uk", "bbc.co.uk", "rival.co.uk", "bigsite.com", "wikipedia.org", "example.com"})
        self.assertEqual(self.data["bigsite.com"][0], 3)
        self.assertNotIn("lonely.uk", self.data)

    def test_manifest_and_files(self):
        m = self.manifest
        self.assertEqual((m["format"], m["scope"], m["release"], m["shards"]), (2, "all", REL, SHARDS))
        self.assertEqual(m["domains"], 6)
        self.assertEqual(m["links"], len(LINKS))
        self.assertGreater(len(m["files"]), 1, "roll-over to a second data file should have happened")

    def test_streaming_mode_matches_spill_mode(self):
        norm = lambda d: {k: (v[0], v[1], sorted(v[2])) for k, v in d.items()}
        self.assertEqual(norm(self.data), norm(self.data2))
        self.assertEqual(self.manifest["domains"], self.manifest2["domains"])
        self.assertFalse(os.path.exists(self.spill), "spill folder should be removed")


if __name__ == "__main__":
    unittest.main(verbosity=2)
