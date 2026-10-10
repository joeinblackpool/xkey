// Every XKey test, in order. Run before every push:  node test/all.mjs
//  1. check.mjs  – every page: titles, descriptions, links, JSON-LD, XKey's own checker
//  2. tools.mjs  – builds the site like Cloudflare does, then clicks through every tool
//  3. mobile.mjs – every page on an iPhone and a Pixel: no sideways scroll, tappable buttons
//  4. crawler/test_crawler.py – the Python crawler against fake sites (needs python3 + crawler/requirements.txt)
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
const here = path.dirname(fileURLToPath(import.meta.url));
let failed = [];
for (const t of ["check.mjs", "tools.mjs", "mobile.mjs"]) {
  console.log(`\n=== ${t} ===`);
  const r = spawnSync(process.execPath, [path.join(here, t)], { stdio: "inherit" });
  if (r.status !== 0) failed.push(t);
}
console.log("\n=== crawler/test_crawler.py ===");
const py = spawnSync(process.platform === "win32" ? "python" : "python3", ["test_crawler.py"], { cwd: path.join(here, "../crawler"), stdio: "inherit" });
if (py.error) console.log("python3 not found – skipped the crawler tests");
else if (py.status !== 0) failed.push("crawler/test_crawler.py");
console.log(failed.length ? `\nFAILED: ${failed.join(", ")}` : "\nAll tests passed.");
process.exit(failed.length ? 1 : 0);
