// Server-side tests for the uptime monitor, website analytics and the WordPress plugin download.
//   node test/pro.mjs
import { d1StandIn } from "./lib.mjs";
import { checkSite, record, parseAlert, siteUrl, createUptime, runUptime, getUptime, stopUptime, uptimeDashboard } from "../src/uptime.js";
import { createSite, beacon, statsApi, siteBySecret, siteHost, pruneAnalytics } from "../src/analytics.js";
import { pluginZip } from "../src/wp-plugin.js";
import { bundle } from "../wordpress-plugin/bundle.mjs";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const kv = () => { const m = new Map(); return { m, get: async (k, t) => { const v = m.get(k); return v == null ? null : (t === "json" || (t && t.type === "json")) ? JSON.parse(v) : v; }, put: async (k, v) => { m.set(k, String(v)); }, delete: async (k) => { m.delete(k); }, list: async ({ prefix = "" } = {}) => ({ keys: [...m.keys()].filter((n) => n.startsWith(prefix)).map((name) => ({ name })) }) }; };
const html = (body, status = 200) => new Response(body, { status, headers: { "content-type": "text/html" } });
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
globalThis.setTimeout = ((orig) => (fn, ms) => orig(fn, Math.min(ms, 5)))(globalThis.setTimeout); // no real waits for re-checks

let failed = 0;
const t = async (name, fn) => { try { if (!(await fn())) throw new Error("returned false"); console.log("  ok  " + name); } catch (e) { failed++; console.log("  FAIL " + name + ": " + (e && e.message)); } };

console.log("Uptime monitor");
await t("up page", async () => (await checkSite("https://a.co.uk/", async () => html("<h1>Hi</h1>"))).ok);
await t("5xx is down", async () => { const c = await checkSite("https://a.co.uk/", async () => html("x", 503)); return !c.ok && /503/.test(c.why); });
await t("database error on a 200 page is down", async () => { const c = await checkSite("https://a.co.uk/", async () => html("<h1>Error establishing a database connection</h1>")); return !c.ok && /Database/.test(c.why); });
await t("timeout / connection failure is down", async () => { const c = await checkSite("https://a.co.uk/", async () => { throw new TypeError("fetch failed"); }); return !c.ok && /connect/.test(c.why); });
await t("403 counts as up with a note", async () => { const c = await checkSite("https://a.co.uk/", async () => html("no", 403)); return c.ok && /403/.test(c.why); });
await t("alerts: ntfy topic, Slack, Discord; other hosts refused", () => parseAlert("my-alerts-123").type === "ntfy" && parseAlert("https://hooks.slack.com/services/x").type === "slack" && parseAlert("https://discord.com/api/webhooks/1/x").type === "discord" && parseAlert("") === null && (() => { try { parseAlert("https://evil.example/hook"); return false; } catch { return true; } })());
await t("address checks", () => siteUrl("example.co.uk") === "https://example.co.uk/" && (() => { try { siteUrl("http://localhost:8080"); return false; } catch { return true; } })());
await t("state changes give one alert each", () => {
  const m = { url: "https://a.co.uk/" }, up = { t: 1, ok: true, ms: 200, status: 200 }, down = { t: 2, ok: false, ms: 0, status: 0, why: "Couldn't connect" };
  const a = [record(m, up), record(m, down), record(m, down), record(m, { ...up, t: 600_002 }), record(m, { ...up, t: 3, slow: true, ms: 5000 })];
  return a[0] === null && /DOWN/.test(a[1]) && a[2] === null && /back up/.test(a[3]) && /slow/.test(a[4]) && m.inc.length === 1 && m.inc[0].e && m.days[new Date(1).toISOString().slice(0, 10)][0] === 5;
});
await t("create, cron merge, alert, dashboard, stop", async () => {
  const env = { STATE: kv() }, sent = [];
  let siteUp = true;
  const f = async (u, init) => { if (/ntfy\.sh/.test(u)) { sent.push(init.body); return new Response("ok"); } return siteUp ? html("fine") : html("down", 502); };
  const form = new FormData(); form.set("url", "shop.co.uk"); form.set("alert", "shop-alerts-99");
  const id = await createUptime(env, form, f);
  if (!(await getUptime(env, id)) || !/now watching/.test(sent[0])) return false;
  siteUp = false;
  const r = await runUptime(env, f);
  const all = JSON.parse(env.STATE.m.get("up:all"));
  if (!/checked 1 of 1, 1 alerts/.test(r) || env.STATE.m.has("up:new:" + id) || all.mons[id].state !== "down" || !/DOWN/.test(sent[1])) return false;
  const page = uptimeDashboard(esc, id, all.mons[id]);
  if (!/Down/.test(page) || !/still down/.test(page)) return false;
  await stopUptime(env, id); await runUptime(env, f);
  return !JSON.parse(env.STATE.m.get("up:all")).mons[id];
});

console.log("Website analytics");
await t("host check", () => siteHost("https://www.Shop.co.uk/x") === "shop.co.uk");
await t("pageviews, visitors, goals, live, referrers; bots and other sites ignored", async () => {
  const env = { ANALYTICS: await d1StandIn(), STATE: kv() };
  const secret = await createSite(env, "shop.co.uk"), site = await siteBySecret(env, secret);
  const hit = (body, headers = {}) => beacon(new Request("https://xkey.co.uk/api/a", { method: "POST", body: JSON.stringify({ k: site.key, ...body }), headers: { "user-agent": "Mozilla/5.0 Chrome/130", origin: "https://shop.co.uk", "cf-connecting-ip": "1.2.3.4", ...headers } }), env);
  await hit({ e: "v", p: "/", r: "https://www.google.com/", w: 390 });
  await hit({ e: "v", p: "/prices?x=1", r: "https://shop.co.uk/", w: 1400 });
  await hit({ e: "v", p: "/", w: 1400 }, { "cf-connecting-ip": "5.6.7.8" });
  await hit({ e: "g", n: "Phone call click" });
  await hit({ e: "o", n: "facebook.com" });
  await hit({ e: "v", p: "/" }, { "user-agent": "Googlebot/2.1" });
  await hit({ e: "v", p: "/" }, { origin: "https://copycat.com" });
  const r = (await statsApi(env, secret, new URLSearchParams("days=7"))).body;
  return r.views === 3 && r.visitors === 2 && r.live === 2 && r.conversions === 1 && r.conversionRate === 50 && r.refs[0].name === "google.com" && r.pages.some((p) => p.name === "/prices") && r.devices.length === 2 && r.outbound[0].name === "facebook.com" && r.series.length === 7 && (await pruneAnalytics(env)) === "pruned";
});
await t("unknown dashboard is 404", async () => (await statsApi({ ANALYTICS: await d1StandIn() }, "AAAAAAAAAAAAAAAA", new URLSearchParams())).status === 404);

console.log("WordPress plugin");
await t("bundle is up to date (run node wordpress-plugin/bundle.mjs)", () => fs.readFileSync(path.join(here, "../src/wp-plugin-files.js"), "utf8") === bundle);
await t("ZIP opens and holds the plugin", () => {
  const f = path.join(os.tmpdir(), "xkey-wp-test.zip"); fs.writeFileSync(f, pluginZip());
  try { const out = execFileSync("python3", ["-c", "import zipfile,sys; z=zipfile.ZipFile(sys.argv[1]); assert z.testzip() is None; print('\\n'.join(z.namelist()))", f]).toString(); return /xkey-seo-fixer\/xkey-seo-fixer\.php/.test(out) && /readme\.txt/.test(out); }
  catch (e) { if (e.code === "ENOENT") { console.log("  (python3 missing – ZIP not opened)"); return true; } throw e; }
});

console.log(failed ? `\n${failed} failed` : "\nAll pro tests passed.");
process.exit(failed ? 1 : 0);
