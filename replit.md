# Kishore Orthopedic Centre

A fully server-rendered orthopedic hospital website built with Node.js, Express, and EJS.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the website server (port 8080, proxy at 80)
- `pnpm --filter @workspace/api-server run build` — force a fresh esbuild bundle
- `pnpm run typecheck` — full typecheck across all packages
- Required env: `PORT` — injected automatically by the Replit artifact system (8080)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Server: Express 5
- Templating: EJS
- Styling: Pure CSS (no Bootstrap) — Poppins + Inter via Google Fonts
- Build: esbuild (CJS→ESM bundle), copies views/ and public/ into dist/
- Logging: pino + pino-http

## Where Things Live

- `artifacts/api-server/src/app.ts` — Express app setup (EJS engine, static files, routes)
- `artifacts/api-server/src/routes/website.ts` — Page route handlers (/, /about, /doctors, /treatments, /contact)
- `artifacts/api-server/views/` — EJS templates (home, about, doctors, treatments, contact)
- `artifacts/api-server/views/partials/` — Shared navbar.ejs and footer.ejs
- `artifacts/api-server/public/css/style.css` — All global CSS (1 file, mobile-first)
- `artifacts/api-server/public/js/main.js` — Navbar hamburger, treatment tabs, contact form, scroll animations
- `artifacts/api-server/build.mjs` — esbuild config; copies views/ and public/ into dist/ after bundle

## Architecture Decisions

- EJS server-side rendering: no client-side framework needed for a brochure site
- Single CSS file: keeps the project beginner-friendly and easy to extend
- `dev` script skips rebuild if dist/index.mjs already exists — makes workflow restarts instant
- Auto-restart loop in the dev script so the server recovers from any crash automatically
- Views and public assets are copied into dist/ at build time so the Node process finds them via `__dirname`

## Product

Five-page orthopedic hospital website:
- **Home** — hero, 6 service cards, why-choose-us, testimonials, CTA
- **About** — clinic story, values, milestone timeline, accreditations
- **Doctors** — 6 specialist profiles with tags and booking buttons
- **Treatments** — 10 treatments with filterable tabs (All / Surgical / Non-Surgical / Rehab)
- **Contact** — appointment booking form, clinic timings, address, emergency banner

## User Preferences

- No Bootstrap — pure CSS only
- Beginner-friendly, modular code structure
- Express + EJS (server-side rendering, not React/Vite)

## Gotchas

- Always run `pnpm --filter @workspace/api-server run build` manually if you change source files and want to force a fresh bundle (the dev script skips build when dist already exists)
- Views and public assets must be in the `views/` and `public/` folders at the artifact root — build.mjs copies them to dist/
- PORT env var is required; it is injected by the Replit artifact system — never hardcode it

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
