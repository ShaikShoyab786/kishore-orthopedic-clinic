# Threat Model

## Project Overview

Kishore Orthopedic Centre is a server-rendered informational website for an orthopedic clinic. The deployed production application is the Express 5 + EJS artifact in `artifacts/api-server`; it serves public brochure pages and a simple health endpoint, with no authentication, database-backed features, file uploads, or admin surface currently exposed in production.

## Assets

- **Site availability and integrity** — the public website must remain reachable and its medical/clinic content must not be altered by unauthorized parties.
- **Visitor-submitted contact details** — the contact page collects names, phone numbers, optional email addresses, and medical-condition text in the browser before redirecting the visitor to WhatsApp. Although the server does not persist this data, the information is still privacy-sensitive.
- **Operational secrets and environment** — runtime environment variables, deployment configuration, and any future server-side credentials must not be exposed through logs, errors, or client assets.
- **Brand trust** — users rely on the site to contact a real clinic. Defacement, malicious redirects, or injected scripts would directly harm patients and the clinic’s reputation.

## Trust Boundaries

- **Browser to Express server** — all page and API requests cross from an untrusted client into the server. Any future dynamic inputs must be validated server-side.
- **Express server to static/template rendering** — EJS templates render server-controlled values into HTML. Any future user-controlled template data would create XSS risk if not escaped correctly.
- **Browser to third-party destinations** — the contact experience redirects users from the site to WhatsApp and may also open Google Maps. Those transitions must remain fixed and not become user-controlled redirect targets.
- **Production artifact to dev-only artifacts** — `artifacts/api-server` is the production runtime. `artifacts/mockup-sandbox` is a design/mockup artifact and should be treated as dev-only unless deployment wiring changes.

## Scan Anchors

- **Production entry points:** `artifacts/api-server/src/index.ts`, `artifacts/api-server/src/app.ts`
- **Public production routes:** `artifacts/api-server/src/routes/website.ts`, `artifacts/api-server/src/routes/health.ts`
- **Client-side sensitive UX:** `artifacts/api-server/views/contact.ejs`, `artifacts/api-server/public/js/main.js`
- **Dev-only areas to usually ignore:** `artifacts/mockup-sandbox/**`, generated preview code, local development helpers

## Threat Categories

### Tampering

The application is mostly static, so tampering risk is concentrated in future dynamic route additions, middleware changes, and any server-side processing added to the contact flow. The server must continue to treat all client input as untrusted, keep redirect destinations fixed or allowlisted, and avoid introducing client-side-only enforcement for anything security-sensitive.

### Information Disclosure

The main disclosure risk is accidental leakage of visitor contact data, environment configuration, or future secrets through logs, templates, static assets, or verbose errors. Public routes and `/api/healthz` must not expose stack traces, internal paths, credentials, or unnecessary operational metadata. Any future server-side handling of contact submissions must avoid logging medical details or contact information.

### Denial of Service

Because the app is public and unauthenticated, any expensive middleware or future submission endpoint could be abused. Public endpoints must keep bounded request parsing, avoid unbounded uploads, and avoid adding resource-intensive work that unauthenticated users can trigger repeatedly.

### Elevation of Privilege

There is currently no authenticated or admin surface in production, so privilege-escalation risk is mostly about future changes. If authentication, admin pages, database access, or file handling are introduced later, authorization checks, parameterized queries, and path validation must be enforced server-side from the start.
