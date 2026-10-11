"""Rebuilds test/fixtures/backlinks/ (format 2) by running backlinks/build.py on a tiny fake web graph.
Run: python test/fixtures/make-backlinks.py"""
import gzip, os, shutil, subprocess, sys, tempfile, threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

HERE = os.path.dirname(os.path.abspath(__file__))
REL = "cc-main-2026-jul-aug-sep"
LINKS = {  # site: websites linking to it
    "smithplumbing.co.uk": ["bbc.co.uk", "bigsite.com", "blog.com"],
    "rival.co.uk": ["wikipedia.org", "bbc.co.uk", "localpaper.co.uk", "blog.com"],
    "example.com": ["wikipedia.org", "bbc.co.uk", "bigsite.com"],
    "shop.com.au": ["example.com", "blog.com"],
    "bbc.co.uk": ["wikipedia.org", "bigsite.com", "blog.com", "localpaper.co.uk", "example.com"],
    "wikipedia.org": ["bbc.co.uk", "bigsite.com", "blog.com", "example.com", "localpaper.co.uk", "rival.co.uk"],
    "bigsite.com": ["wikipedia.org", "bbc.co.uk"],
    "localpaper.co.uk": ["bbc.co.uk"],
    "com.au": ["wikipedia.org"],
}
rev = lambda d: ".".join(reversed(d.split(".")))
names = sorted({d for k, v in LINKS.items() for d in [k, *v]} | {"lonely.co.uk"}, key=rev)
ids = {d: i for i, d in enumerate(names)}
tmp = tempfile.mkdtemp()
d = os.path.join(tmp, REL, "domain"); os.makedirs(d)
with gzip.open(os.path.join(d, f"{REL}-domain-vertices.txt.gz"), "wt") as f:
    for n in names: f.write(f"{ids[n]}\t{rev(n)}\t1\n")
with gzip.open(os.path.join(d, f"{REL}-domain-edges.txt.gz"), "wt") as f:
    for a, b in sorted((ids[s], ids[t]) for t, ss in LINKS.items() for s in ss): f.write(f"{a}\t{b}\n")
# harmonic centrality positions: most-linked first, the unlinked site last
ranked = sorted(names, key=lambda n: (-len(LINKS.get(n, [])), n))
with gzip.open(os.path.join(d, f"{REL}-domain-ranks.txt.gz"), "wt") as f:
    f.write("#harmonicc_pos\t#harmonicc_val\t#pr_pos\t#pr_val\t#host_rev\t#n_hosts\n")
    for pos, n in enumerate(ranked, 1): f.write(f"{pos}\t{100 / pos:.3f}\t{pos}\t0.01\t{rev(n)}\t1\n")
srv = ThreadingHTTPServer(("127.0.0.1", 0), partial(SimpleHTTPRequestHandler, directory=tmp))
srv.RequestHandlerClass.log_message = lambda *a: None
threading.Thread(target=srv.serve_forever, daemon=True).start()
out = os.path.join(HERE, "backlinks")
shutil.rmtree(out, ignore_errors=True)
subprocess.run([sys.executable, os.path.join(HERE, "../../backlinks/build.py"), REL, "--base", f"http://127.0.0.1:{srv.server_address[1]}",
                "--out", out, "--shards", "1024", "--parts", "2", "--max-file", "300"], check=True)
shutil.rmtree(tmp)
