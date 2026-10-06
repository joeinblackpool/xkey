# XKey – free SEO & AI search check

Source for [xkey.co.uk](https://xkey.co.uk), made by [IceWork](https://icework.co.uk).
A single Cloudflare Worker: every push to `main` builds and deploys automatically (Workers Builds).

- `src/` – XKey pages, tools and routing
- `engine/` – the SEO checker engine, shared with icework.co.uk (copied from joeinblackpool/FleaBag `src/`; keep the two in step)
- `test/check.mjs` – pre-deploy checks: `node test/check.mjs`
