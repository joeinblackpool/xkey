// Google algorithm updates tracker: the live list from Google's own Search Status Dashboard
// (status.search.google.com/incidents.json – Google's public feed, not search results). The page is a
// normal PAGES entry; index.js swaps the <!--gsd--> marker for the list, cached for an hour.
// Nothing is ever made up: if the feed can't be read, the page says so and links to the dashboard.
import { esc } from "./site.js";

const FEED = "https://status.search.google.com/incidents.json";
export const GSD_MARK = "<!--gsd-->";
const day = (s) => new Date(s).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const KIND = [[/core update/i, "Core update", "Reassesses how good and relevant pages are across the board. Big ranking swings, both ways."], [/spam update/i, "Spam update", "Targets sites breaking Google's spam policies."], [/helpful content/i, "Helpful content", "Rewards pages written for people over pages written for search engines."], [/review/i, "Reviews update", "Rewards in-depth, first-hand reviews."], [/site reputation|abuse/i, "Spam policy", "Targets a specific kind of spam."], [/./, "Other", ""]];

/** Pure: Google's incidents.json → ranking updates (newest first) and ongoing problems with Search itself. */
export function parseIncidents(list) {
  const rows = (Array.isArray(list) ? list : []).filter((x) => x && x.begin && x.external_desc).map((x) => {
    const name = String(x.external_desc).trim(), k = KIND.find(([re]) => re.test(name));
    const days = x.end ? Math.max(1, Math.round((Date.parse(x.end) - Date.parse(x.begin)) / 86_400_000)) : null;
    const note = (x.updates || []).map((u) => String(u.text || "")).reverse().find((t) => t.length > 20) || "";
    return { name, kind: k[1], about: k[2], begin: x.begin, end: x.end || null, days, service: x.service_name || "", note: note.replace(/<(https?:\/\/[^>]+)>/g, "").replace(/\s+/g, " ").trim().slice(0, 400), link: x.uri ? `https://status.search.google.com/${String(x.uri).replace(/^\//, "")}` : "https://status.search.google.com/" };
  }).sort((a, b) => Date.parse(b.begin) - Date.parse(a.begin));
  return { ranking: rows.filter((r) => /ranking/i.test(r.service)), other: rows.filter((r) => !/ranking/i.test(r.service)) };
}

/** Pure: the HTML that replaces the marker. */
export function updatesHtml(p, now = Date.now()) {
  if (!p || !p.ranking.length && !p.other.length) return `<p class="s-warn">We couldn't read Google's Search Status Dashboard just now. See the latest updates at <a href="https://status.search.google.com/products/rGHU1u87FJnkP6W2GwMi/history" rel="noopener">status.search.google.com</a>.</p>`;
  const live = p.ranking.filter((r) => !r.end);
  const banner = live.length ? `<div class="card" style="margin:12px 0"><p style="margin:0"><strong class="s-warn">Rolling out now:</strong> ${live.map((r) => `${esc(r.name)} (since ${day(r.begin)})`).join(", ")}. Expect rankings to move until Google says it's complete – don't make big changes to your site because of a few days' swings.</p></div>` : `<p><strong class="s-pass">No ranking update is rolling out right now</strong> (checked ${new Date(now).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" })} UK time).</p>`;
  const table = (rows) => `<div class="tablewrap"><table><thead><tr><th>Update</th><th>Started</th><th>Finished</th><th>Took</th></tr></thead><tbody>${rows.map((r) => `<tr><td><a href="${esc(r.link)}" rel="noopener">${esc(r.name)}</a>${r.about ? `<br><span class="small">${esc(r.about)}</span>` : ""}</td><td>${day(r.begin)}</td><td>${r.end ? day(r.end) : '<strong class="s-warn">Still rolling out</strong>'}</td><td>${r.days ? `${r.days} day${r.days > 1 ? "s" : ""}` : "–"}</td></tr>`).join("")}</tbody></table></div>`;
  return banner + (p.ranking.length ? table(p.ranking) : "<p>Google hasn't listed any ranking updates in its current feed.</p>") +
    (p.other.length ? `<h3>Other problems Google has reported</h3><p class="small">Indexing, crawling or serving problems on Google's side – if your pages dropped out at the same time, this may be why.</p><ul>${p.other.slice(0, 8).map((r) => `<li><a href="${esc(r.link)}" rel="noopener">${esc(r.name)}</a> – ${r.service ? esc(r.service) + ", " : ""}${day(r.begin)}${r.end ? ` to ${day(r.end)}` : ", ongoing"}</li>`).join("")}</ul>` : "");
}

/** Server: fetch (cached an hour at the edge) and render. fetchImpl defaults to fetch; tests pass env.GSD_FETCH. */
export async function googleUpdatesSection(env = {}, ctx) {
  const cache = typeof caches !== "undefined" && !env.GSD_FETCH ? caches.default : null, key = "https://xkey.co.uk/__gsd/v1";
  try { const hit = cache && await cache.match(key); if (hit) return await hit.text(); } catch {}
  let html;
  try {
    const r = await (env.GSD_FETCH || fetch)(FEED, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(5000) });
    if (!r.ok) throw new Error("HTTP " + r.status);
    html = updatesHtml(parseIncidents(await r.json()));
  } catch { return updatesHtml(null); }
  try { if (cache && ctx) ctx.waitUntil(cache.put(key, new Response(html, { headers: { "cache-control": "public, max-age=3600" } }))); } catch {}
  return html;
}
