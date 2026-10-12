// Free backlink checker: looks a domain up in the index that backlinks/build.py makes from Common
// Crawl's public domain-level web graph and publishes as this repo's latest GitHub release.
//
// Format 2 (scope "all": every domain):
//   manifest.json   – release info, release tag, shard count, data file names
//   bl-index.bin    – per shard three little-endian uint32: data file number, byte offset, length
//   bl-data-N.bin   – gzipped text shards; lines "domain\tref_domains\tstrength\tlinker:strength,…\thc_rank"
//                     (hc_rank – Common Crawl's harmonic centrality position, 1 = most central – is
//                     missing in releases built before it was added, and 0 when not ranked)
//   shard = crc32(domain) % shards (zlib's crc32, as in build.py)
// Format 1 (.uk only, the first release): manifest.json with byte "offsets" into bl-data.bin, whose
//   shards are gzipped JSON {domain: [ref_domains, strength, [[linker, strength], …]]};
//   shard = fnv1a32(domain) % shards.
// A lookup reads only its shard (~40 kB) with an HTTP Range request – never a whole data file.

const REPO = "https://github.com/joeinblackpool/xkey/releases";
const UK_SECOND = new Set(["co", "org", "ltd", "plc", "net", "me", "ac", "gov", "nhs", "police", "sch", "mod", "nic", "parliament"]);
// Second-level labels used under country codes (example.com.au, example.co.nz): never report "com.au" itself.
const CC_SECOND = new Set(["co", "com", "net", "org", "gov", "edu", "ac", "ltd", "plc", "me", "nhs", "or", "ne", "go", "gob", "gv", "nom", "mil", "sch", "info", "biz"]);

export function fnv1a32(s) {
  let h = 2166136261;
  for (const b of new TextEncoder().encode(s)) { h ^= b; h = Math.imul(h, 16777619) >>> 0; }
  return h >>> 0;
}

let CRC_TABLE;
/** Same result as Python's zlib.crc32(s.encode()). */
export function crc32(s) {
  if (!CRC_TABLE) {
    CRC_TABLE = new Uint32Array(256);
    for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; CRC_TABLE[n] = c >>> 0; }
  }
  let c = 0xffffffff;
  for (const b of new TextEncoder().encode(s)) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** "https://www.Smith.co.uk/page" -> { domain: "smith.co.uk", uk: true, tries: ["smith.co.uk"] }
 *  "shop.example.com" -> { domain: "example.com", uk: false, tries: ["shop.example.com", "example.com"] } */
export function siteDomain(input) {
  let s = String(input || "").trim().toLowerCase();
  if (!s) throw new Error("Enter a website address.");
  if (!/^[a-z]+:\/\//.test(s)) s = "http://" + s;
  let host;
  try { host = new URL(s).hostname.replace(/\.$/, ""); } catch { throw new Error("That doesn't look like a website address."); }
  if (!/^[a-z0-9.-]+\.[a-z0-9-]{2,}$/.test(host) || /^[\d.]+$/.test(host)) throw new Error("That doesn't look like a website address.");
  const labels = host.replace(/^www\./, "").split(".");
  const n = labels.length, last = (k) => labels.slice(-k).join(".");
  if (labels[n - 1] === "uk") {
    const d = last(n >= 3 && UK_SECOND.has(labels[n - 2]) ? 3 : 2);
    return { domain: d, uk: true, tries: [d] };
  }
  // The web graph uses registered domains (example.com, example.com.au, user.github.io): try the
  // last three labels, then the last two – unless the last two are a country's "com.au"-style suffix.
  if (n < 3) return { domain: last(2), uk: false, tries: [last(2)] };
  const ccSuffix = labels[n - 1].length === 2 && CC_SECOND.has(labels[n - 2]);
  return { domain: ccSuffix ? last(3) : last(2), uk: false, tries: ccSuffix ? [last(3)] : [last(3), last(2)] };
}

/** "cc-main-2026-jul-aug-sep" -> "July–September 2026" */
export function crawlMonths(release) {
  const M = { jan: "January", feb: "February", mar: "March", apr: "April", may: "May", jun: "June", jul: "July", aug: "August", sep: "September", oct: "October", nov: "November", dec: "December" };
  const m = String(release || "").match(/(\d{4})-([a-z]{3})(?:-[a-z]{3})*-([a-z]{3})$/);
  return m ? `${M[m[2]]}–${M[m[3]]} ${m[1]}` : String(release || "");
}

async function gunzipText(buf) {
  const stream = new Response(buf).body.pipeThrough(new DecompressionStream("gzip"));
  return new Response(stream).text();
}

// Fetch a published file (or the byte range [start, end] of one), cached at the edge.
// Tests pass env.BL_DATA = { manifest() -> object, file(name, range?) -> Uint8Array }.
async function published(ctx, path, ttl, range) {
  const cache = typeof caches !== "undefined" ? caches.default : null;
  const key = new Request(`https://xkey.co.uk/__bl/${path}${range ? `?r=${range[0]}-${range[1]}` : ""}`);
  const hit = cache && (await cache.match(key));
  if (hit) return hit.arrayBuffer();
  const headers = { "user-agent": "xkey.co.uk backlink checker" };
  if (range) headers.range = `bytes=${range[0]}-${range[1]}`;
  const res = await fetch(`${REPO}/${path}`, { headers });
  if (range ? res.status !== 206 : !res.ok) { try { res.body && res.body.cancel(); } catch {} return null; } // never read a whole data file
  const buf = await res.arrayBuffer();
  if (cache) ctx.waitUntil(cache.put(key, new Response(buf, { headers: { "cache-control": `max-age=${ttl}` } })));
  return buf;
}

function releaseFile(env, ctx, m, name, range) {
  if (env && env.BL_DATA) return env.BL_DATA.file(name, range);
  return published(ctx, `download/${m.tag || `backlinks-${m.release}`}/${name}`, 30 * 86400, range);
}

export async function manifest(env, ctx) {
  if (env && env.BL_DATA) return env.BL_DATA.manifest();
  const buf = await published(ctx, "latest/download/manifest.json", 21600);
  return buf ? JSON.parse(new TextDecoder().decode(buf)) : null;
}

// bl-index.bin (12 bytes per shard, ~1.5 MB) is read whole once per release and kept in memory.
const indexes = new Map();
async function shardIndex(env, ctx, m) {
  const id = m.tag || m.release;
  if (!indexes.has(id)) {
    const p = Promise.resolve(releaseFile(env, ctx, m, m.index || "bl-index.bin")).then((buf) => {
      if (!buf || buf.byteLength !== m.shards * 12) throw new Error("The backlink data couldn't be loaded – please try again in a minute.");
      const b = buf instanceof Uint8Array ? buf : new Uint8Array(buf), dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
      const out = new Uint32Array(m.shards * 3);
      for (let i = 0; i < out.length; i++) out[i] = dv.getUint32(i * 4, true);
      return out;
    });
    p.catch(() => indexes.delete(id));
    indexes.clear(); // only the current release is needed
    indexes.set(id, p);
  }
  return indexes.get(id);
}

const NOT_FOUND = (domain) => ({ domain, found: false, refDomains: 0, strength: 0, linkers: [], rank: 0 });
const LOAD_ERROR = "The backlink data couldn't be loaded – please try again in a minute.";

async function lookup1(env, ctx, m, domain) {
  const i = fnv1a32(domain) % m.shards, start = m.offsets[i], end = m.offsets[i + 1] - 1;
  if (end < start) return NOT_FOUND(domain);
  const buf = await releaseFile(env, ctx, m, "bl-data.bin", [start, end]);
  if (!buf) throw new Error(LOAD_ERROR);
  const row = JSON.parse(await gunzipText(buf))[domain];
  return row ? { domain, found: true, refDomains: row[0], strength: row[1], linkers: row[2] } : NOT_FOUND(domain);
}

async function lookup2(env, ctx, m, domain) {
  const idx = await shardIndex(env, ctx, m), i = crc32(domain) % m.shards;
  const file = idx[i * 3], start = idx[i * 3 + 1], len = idx[i * 3 + 2];
  if (!len) return NOT_FOUND(domain);
  const buf = await releaseFile(env, ctx, m, m.files[file], [start, start + len - 1]);
  if (!buf) throw new Error(LOAD_ERROR);
  const text = await gunzipText(buf), at = text.indexOf(`\n${domain}\t`);
  if (at < 0) return NOT_FOUND(domain);
  const [, n, s, list, hc] = text.slice(at + 1, text.indexOf("\n", at + 1)).split("\t");
  const linkers = list ? list.split(",").map((x) => { const c = x.lastIndexOf(":"); return [x.slice(0, c), +x.slice(c + 1)]; }) : [];
  return { domain, found: true, refDomains: +n, strength: +s, linkers, rank: +hc || 0 };
}

// Try each candidate name (e.g. shop.example.com, then example.com); report the first one found.
async function lookup(env, ctx, m, site) {
  for (const d of site.tries) {
    const r = m.format === 2 ? await lookup2(env, ctx, m, d) : await lookup1(env, ctx, m, d);
    if (r.found) return r;
  }
  return NOT_FOUND(site.domain);
}

/** One site's row from the current release (null manifest = data unavailable). Used by the /site/ reports. */
export async function siteLinks(env, ctx, site) {
  const m = await manifest(env, ctx);
  if (!m) return { m: null, r: null };
  if (m.scope !== "all" && !site.uk) return { m, r: NOT_FOUND(site.domain) };
  return { m, r: await lookup(env, ctx, m, site) };
}

/** GET /api/backlinks?d=yoursite.com&vs=competitor.com */
export async function backlinksApi(env, ctx, params) {
  let me, vs = null;
  try { me = siteDomain(params.get("d")); if (params.get("vs") && params.get("vs").trim()) vs = siteDomain(params.get("vs")); }
  catch (e) { return { status: 400, body: { error: e.message } }; }
  const m = await manifest(env, ctx);
  if (!m) return { status: 503, body: { error: "The backlink data is being updated – please try again in a few minutes." } };
  const notUk = m.scope === "all" ? [] : [me, vs].filter((x) => x && !x.uk).map((x) => x.domain);
  if (notUk.length) return { status: 400, body: { error: `The backlink checker covers UK websites (.uk addresses) for now – ${notUk.join(" and ")} isn't one. Other domains are being added.` } };
  try {
    const you = await lookup(env, ctx, m, me);
    const out = { you, months: crawlMonths(m.release), release: m.release, topK: m.top_k };
    if (vs) {
      const them = await lookup(env, ctx, m, vs);
      if (them.domain !== you.domain) {
        const mine = new Set(you.linkers.map((l) => l[0]).concat(you.domain));
        out.them = them;
        out.gap = them.linkers.filter((l) => !mine.has(l[0])).slice(0, 50);
        out.shared = them.linkers.filter((l) => mine.has(l[0]) && l[0] !== you.domain).length;
      }
    }
    return { status: 200, body: out };
  } catch (e) { return { status: 503, body: { error: e.message } }; }
}

/** Authority 0–100 from a harmonic centrality position: 100 for the most central site on the web,
 *  falling evenly with each tenfold drop in position, to 0 at the last of `ranked` domains. Without
 *  a position (older releases) it falls back to link strength (referring domains, log scale). */
export function authority(r, ranked) {
  if (!r.found) return 0;
  if (!r.rank || !(ranked > 1)) return r.strength;
  return Math.max(1, Math.min(100, Math.round(100 * (1 - Math.log(r.rank) / Math.log(ranked)))));
}

export const AUTHORITY_BATCH = 10;

/** GET /api/authority?d=site1.com,site2.co.uk,… (up to AUTHORITY_BATCH; the page sends longer lists in batches) */
export async function authorityApi(env, ctx, params) {
  const raw = String(params.get("d") || "").split(/[\s,]+/).map((x) => x.trim()).filter(Boolean);
  if (!raw.length) return { status: 400, body: { error: "Enter at least one website address." } };
  if (raw.length > AUTHORITY_BATCH) return { status: 400, body: { error: `Up to ${AUTHORITY_BATCH} websites per request.` } };
  const m = await manifest(env, ctx);
  if (!m) return { status: 503, body: { error: "The link data is being updated – please try again in a few minutes." } };
  try {
    const results = [];
    for (const input of raw) {
      let site;
      try { site = siteDomain(input); } catch (e) { results.push({ input, error: e.message }); continue; }
      if (m.scope !== "all" && !site.uk) { results.push({ input, domain: site.domain, error: "Only .uk websites are covered for now." }); continue; }
      const r = await lookup(env, ctx, m, site);
      results.push({ input, domain: r.domain, found: r.found, authority: authority(r, m.ranked), rank: r.rank || 0, refDomains: r.refDomains, strength: r.strength, top: r.linkers.slice(0, 3).map((l) => l[0]) });
    }
    return { status: 200, body: { results, months: crawlMonths(m.release), release: m.release, ranked: m.ranked || 0, ranks: !!m.ranked } };
  } catch (e) { return { status: 503, body: { error: e.message } }; }
}
