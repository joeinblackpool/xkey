// Free UK backlink checker: looks a .uk domain up in the index that backlinks/build.py makes from
// Common Crawl's public domain-level web graph and publishes as this repo's latest GitHub release:
// manifest.json (release info + byte offsets) and bl-data.bin (gzipped JSON shards back to back).
// Shard i holds the domains whose fnv1a32(domain) % shards === i (same function as build.py); a lookup
// reads only bytes offsets[i]..offsets[i+1]-1 of bl-data.bin with an HTTP Range request (~40 kB).

const REPO = "https://github.com/joeinblackpool/xkey/releases";
const UK_SECOND = new Set(["co", "org", "ltd", "plc", "net", "me", "ac", "gov", "nhs", "police", "sch", "mod", "nic", "parliament"]);

export function fnv1a32(s) {
  let h = 2166136261;
  for (const b of new TextEncoder().encode(s)) { h ^= b; h = Math.imul(h, 16777619) >>> 0; }
  return h >>> 0;
}

/** "https://www.Smith.co.uk/page" -> { domain: "smith.co.uk", uk: true } */
export function siteDomain(input) {
  let s = String(input || "").trim().toLowerCase();
  if (!s) throw new Error("Enter a website address.");
  if (!/^[a-z]+:\/\//.test(s)) s = "http://" + s;
  let host;
  try { host = new URL(s).hostname.replace(/\.$/, ""); } catch { throw new Error("That doesn't look like a website address."); }
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(host)) throw new Error("That doesn't look like a website address.");
  const labels = host.split(".");
  const uk = labels[labels.length - 1] === "uk";
  const keep = uk && labels.length >= 3 && UK_SECOND.has(labels[labels.length - 2]) ? 3 : 2;
  return { domain: labels.slice(-keep).join("."), uk };
}

/** "cc-main-2026-jul-aug-sep" -> "July–September 2026" */
export function crawlMonths(release) {
  const M = { jan: "January", feb: "February", mar: "March", apr: "April", may: "May", jun: "June", jul: "July", aug: "August", sep: "September", oct: "October", nov: "November", dec: "December" };
  const m = String(release || "").match(/(\d{4})-([a-z]{3})(?:-[a-z]{3})*-([a-z]{3})$/);
  return m ? `${M[m[2]]}–${M[m[3]]} ${m[1]}` : String(release || "");
}

async function gunzipJson(buf) {
  const stream = new Response(buf).body.pipeThrough(new DecompressionStream("gzip"));
  return JSON.parse(await new Response(stream).text());
}

// Fetch (part of) a published file, cached at the edge.
// Tests pass env.BL_DATA = { manifest() -> object, range(start, end) -> Uint8Array }.
async function published(ctx, path, ttl, range) {
  const cache = typeof caches !== "undefined" ? caches.default : null;
  const key = new Request(`https://xkey.co.uk/__bl/${path}${range ? `?r=${range[0]}-${range[1]}` : ""}`);
  const hit = cache && (await cache.match(key));
  if (hit) return hit.arrayBuffer();
  const headers = { "user-agent": "xkey.co.uk backlink checker" };
  if (range) headers.range = `bytes=${range[0]}-${range[1]}`;
  const res = await fetch(`${REPO}/${path}`, { headers });
  if (range ? res.status !== 206 : !res.ok) { try { res.body && res.body.cancel(); } catch {} return null; } // never read a whole 160 MB file
  const buf = await res.arrayBuffer();
  if (cache) ctx.waitUntil(cache.put(key, new Response(buf, { headers: { "cache-control": `max-age=${ttl}` } })));
  return buf;
}

export async function manifest(env, ctx) {
  if (env && env.BL_DATA) return env.BL_DATA.manifest();
  const buf = await published(ctx, "latest/download/manifest.json", 21600);
  return buf ? JSON.parse(new TextDecoder().decode(buf)) : null;
}

async function lookup(env, ctx, m, domain) {
  const i = fnv1a32(domain) % m.shards, start = m.offsets[i], end = m.offsets[i + 1] - 1;
  const buf = env && env.BL_DATA ? env.BL_DATA.range(start, end) : await published(ctx, `download/backlinks-${m.release}/bl-data.bin`, 30 * 86400, [start, end]);
  if (!buf) throw new Error("The backlink data couldn't be loaded – please try again in a minute.");
  const shard = await gunzipJson(buf);
  const row = shard[domain];
  return row ? { domain, found: true, refDomains: row[0], strength: row[1], linkers: row[2] } : { domain, found: false, refDomains: 0, strength: 0, linkers: [] };
}

/** GET /api/backlinks?d=yoursite.co.uk&vs=competitor.co.uk */
export async function backlinksApi(env, ctx, params) {
  let me, vs = null;
  try { me = siteDomain(params.get("d")); if (params.get("vs") && params.get("vs").trim()) vs = siteDomain(params.get("vs")); }
  catch (e) { return { status: 400, body: { error: e.message } }; }
  const notUk = [me, vs].filter((x) => x && !x.uk).map((x) => x.domain);
  if (notUk.length) return { status: 400, body: { error: `The backlink checker covers UK websites (.uk addresses) for now – ${notUk.join(" and ")} isn't one. We're working on adding .com and others.` } };
  const m = await manifest(env, ctx);
  if (!m) return { status: 503, body: { error: "The backlink data is being updated – please try again in a few minutes." } };
  try {
    const you = await lookup(env, ctx, m, me.domain);
    const out = { you, months: crawlMonths(m.release), release: m.release, topK: m.top_k };
    if (vs && vs.domain !== me.domain) {
      const them = await lookup(env, ctx, m, vs.domain);
      const mine = new Set(you.linkers.map((l) => l[0]).concat(me.domain));
      out.them = them;
      out.gap = them.linkers.filter((l) => !mine.has(l[0])).slice(0, 50);
      out.shared = them.linkers.filter((l) => mine.has(l[0]) && l[0] !== me.domain).length;
    }
    return { status: 200, body: out };
  } catch (e) { return { status: 503, body: { error: e.message } }; }
}
