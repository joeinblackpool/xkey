// Keeps src/page-dates.js up to date: each page's first-published date, last-changed date and a hash
// of its content. A new page, or a page whose content changed, gets today's date. Run by test/all.mjs
// before the other tests; commit the file it writes.
//   node test/dates.mjs          update the file
//   node test/dates.mjs --seed   rebuild every date from git history (needs the full history)
import { writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(root, "src/page-dates.js");
const { pageHash } = await import("../src/site.js");
const { DATES } = await import("../src/page-dates.js");
const { PAGES } = await import("../src/content.js");
const today = new Date().toISOString().slice(0, 10);
const write = (d) => writeFileSync(file, `// Written by \`node test/dates.mjs\` – [first published, last changed, content hash] per page.\nexport const DATES = {\n${Object.keys(d).sort().map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(d[k])},`).join("\n")}\n};\n`);

if (process.argv.includes("--seed")) {
  const git = (...a) => execFileSync("git", a, { cwd: root, encoding: "utf8" }).trim();
  const commits = git("log", "--reverse", "--format=%H %cs", "--", "src").split("\n").map((l) => l.split(" "));
  const tmp = mkdtempSync(path.join(tmpdir(), "xkey-dates-")), seen = {};
  for (const [sha, day] of commits) {
    const dir = path.join(tmp, sha);
    execFileSync("git", ["worktree", "add", "--detach", "-q", dir, sha], { cwd: root });
    try {
      const { PAGES: old } = await import(pathToFileURL(path.join(dir, "src/content.js")).href);
      for (const p of old) { const h = pageHash(p), s = seen[p.path]; if (!s) seen[p.path] = [day, day, h]; else if (s[2] !== h) seen[p.path] = [s[0], day, h]; }
    } catch (e) { console.log(`skipped ${sha.slice(0, 7)}: ${e.message}`); }
    execFileSync("git", ["worktree", "remove", "--force", dir], { cwd: root });
  }
  rmSync(tmp, { recursive: true, force: true });
  Object.assign(DATES, seen);
}
const out = {};
let changed = 0;
for (const p of PAGES) {
  const h = pageHash(p), d = DATES[p.path];
  out[p.path] = !d ? [today, today, h] : d[2] === h ? d : [d[0], today, h];
  if (!d || d[2] !== h) changed++;
}
const removed = Object.keys(DATES).filter((k) => !out[k]).length;
write(out);
console.log(changed || removed ? `page dates: ${changed} new or changed, ${removed} removed – commit src/page-dates.js` : "page dates: up to date");
