"""Offline test for build.py: a tiny fake web graph with known answers.  Run: python backlinks/test_build.py"""
import gzip, json, os, subprocess, sys, tempfile, threading, unittest
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from functools import partial

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import build  # noqa: E402

REL = "cc-test"
# id, reversed domain
DOMAINS = ["com.bigsite", "uk.co.bbc", "uk.co.smithplumbing", "uk.org.charity", "com.blog", "uk.co.rival", "org.wikipedia", "uk.lonely"]
# links: (from, to) by name
LINKS = [("com.bigsite", "uk.co.smithplumbing"), ("uk.co.bbc", "uk.co.smithplumbing"), ("com.blog", "uk.co.smithplumbing"),
         ("org.wikipedia", "uk.co.bbc"), ("com.bigsite", "uk.co.bbc"), ("com.blog", "uk.co.bbc"), ("uk.org.charity", "uk.co.bbc"),
         ("org.wikipedia", "com.bigsite"), ("uk.co.bbc", "com.bigsite"), ("com.blog", "com.bigsite"),
         ("org.wikipedia", "uk.co.rival"), ("com.blog", "uk.co.rival"), ("uk.co.bbc", "org.wikipedia")]


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
        cls.out = os.path.join(cls.tmp, "shards")
        subprocess.run([sys.executable, os.path.join(HERE, "build.py"), REL, "--base", f"http://127.0.0.1:{srv.server_address[1]}", "--out", cls.out], check=True)
        cls.data = {}
        with open(os.path.join(cls.out, "manifest.json")) as f:
            cls.manifest = json.load(f)
        off = cls.manifest["offsets"]
        assert len(off) == build.SHARDS + 1
        with open(os.path.join(cls.out, "bl-data.bin"), "rb") as f:
            blob = f.read()
        assert len(blob) == off[-1]
        for i in range(build.SHARDS):
            for k, v in json.loads(gzip.decompress(blob[off[i]:off[i + 1]])).items():
                cls.data[k] = v
                assert build.fnv1a32(k) % build.SHARDS == i, "domain in the wrong shard"

    def test_counts_and_order(self):
        n, s, linkers = self.data["smithplumbing.co.uk"]
        self.assertEqual(n, 3)
        names = [x[0] for x in linkers]
        self.assertEqual(set(names), {"bigsite.com", "bbc.co.uk", "blog.com"})
        self.assertEqual(names[:2], ["bbc.co.uk", "bigsite.com"], "strongest linkers first (bbc has 4 linkers, bigsite 3, blog 0)")
        strengths = [x[1] for x in linkers]
        self.assertEqual(strengths, sorted(strengths, reverse=True))

    def test_only_uk_targets_and_unlinked_left_out(self):
        self.assertNotIn("bigsite.com", self.data)
        self.assertNotIn("lonely.uk", self.data)
        self.assertEqual(set(self.data), {"smithplumbing.co.uk", "bbc.co.uk", "rival.co.uk"})

    def test_manifest(self):
        m = self.manifest
        self.assertEqual(m["release"], REL)
        self.assertEqual(m["domains"], 3)
        self.assertEqual(m["links"], len(LINKS))
        self.assertEqual(m["uk_domains"], 5)


if __name__ == "__main__":
    unittest.main(verbosity=2)
