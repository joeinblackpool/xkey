// Shared helpers for XKey's tests.
// - serve(): runs the Worker locally on a port with stand-ins for Cloudflare's Cache API, KV and
//   Workers AI, so every page, API and tool works offline. Checks of xkey.co.uk itself run
//   in-process (the Worker never fetches its own domain), so full SEO checks, audits and
//   comparisons can be tested without the internet.
// - need(name): loads a dev tool (playwright, esbuild) from the project, the global npm folder
//   or a known tools folder, with a clear message if it's missing.
import http from "node:http";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import path from "node:path";

export async function need(name) {
  const tries = [];
  try { return await import(name); } catch (e) { tries.push(e.code || e.message); }
  const roots = [];
  try { roots.push(execSync("npm root -g", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim()); } catch {}
  roots.push("/opt/npm-tools/node_modules", "/usr/local/lib/node_modules", "/usr/lib/node_modules");
  for (const root of roots) {
    try {
      const req = createRequire(path.join(root, "noop.js"));
      const m = await import(pathToFileURL(req.resolve(name)).href);
      return m.default && typeof m.default === "object" ? { ...m.default, ...m } : m; // CommonJS packages put their exports on .default
    } catch {}
  }
  console.error(`\n${name} is needed for this test. Install it with:  npm i -g ${name}${name === "playwright" ? " && npx playwright install chromium" : ""}\n`);
  process.exit(2);
}

/** Start the Worker on `port`. Returns { url, close, env }. */
export async function serve(port = 8789, workerPath = "../src/index.js") {
  const store = new Map();
  globalThis.caches = { default: {
    async match(k) { const v = store.get(typeof k === "string" ? k : k.url); return v ? new Response(v.body, { status: v.status, headers: v.headers }) : undefined; },
    async put(k, r) { store.set(typeof k === "string" ? k : k.url, { body: await r.clone().arrayBuffer(), status: r.status, headers: [...r.headers] }); },
    async delete(k) { return store.delete(typeof k === "string" ? k : k.url); },
  } };
  const kv = new Map();
  const STATE = {
    get: async (k, t) => { const v = kv.get(k); return v == null ? null : t === "json" ? JSON.parse(v) : v; },
    put: async (k, v) => { kv.set(k, String(v)); }, delete: async (k) => { kv.delete(k); },
    list: async ({ prefix = "" } = {}) => ({ keys: [...kv.keys()].filter((n) => n.startsWith(prefix)).map((name) => ({ name })), list_complete: true }),
  };
  const AI = { run: async () => ({ response: JSON.stringify({
    titles: ["Emergency Plumber in Preston | 24/7, No Call-Out Fee", "Preston Plumber – Fixed Prices, Gas Safe", "24 Hour Plumber Preston | Fast Local Help"],
    descriptions: ["Emergency plumber in Preston for leaks, boilers and blocked drains. Gas Safe engineers, fixed prices and no call-out fee. Call today.", "Local Preston plumbers, 24 hours a day. Fixed prices and friendly, tidy engineers – get a free quote now.", "Fast, fixed-price plumbing across Preston and Lancashire. Leaks, boilers and drains sorted today."],
  }) }) };
  const env = { STATE, AI };
  const worker = (await import(new URL(workerPath, import.meta.url).href)).default;
  const server = http.createServer(async (req, res) => {
    const chunks = []; for await (const c of req) chunks.push(c);
    const body = ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.concat(chunks);
    try {
      const r = await worker.fetch(new Request("https://xkey.co.uk" + req.url, { method: req.method, headers: req.headers, body }), env, { waitUntil() {}, passThroughOnException() {} });
      const h = Object.fromEntries(r.headers);
      if (h.location) h.location = h.location.replace("https://xkey.co.uk", "");
      res.writeHead(r.status, h); res.end(Buffer.from(await r.arrayBuffer()));
    } catch (e) { console.error("worker error on", req.url, e); res.writeHead(500); res.end(String(e && e.stack)); }
  });
  await new Promise((ok) => server.listen(port, ok));
  return { url: `http://localhost:${port}`, env, close: () => new Promise((ok) => server.close(ok)) };
}
