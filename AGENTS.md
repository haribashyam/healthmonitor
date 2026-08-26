# AGENTS.md — VitalSync

## Stack
- Single Express server (`server.ts`) running on port 3000, with Vite in middleware mode serving the React SPA from source (dev: `npm run dev` → `tsx server.ts`).
- Client + API share one origin (no separate API port). Auth/data uses Firebase client-side.
- Build: `vite build && esbuild server.ts` → `dist/server.cjs` (not used in dev).

## Running in Base44
- `docker compose -f docker-compose.base44.yml up -d` — Node 22 image, source bind-mounted, deps installed at startup, `npm run dev` with HMR.
- Preview reaches port 3000; `vite.config.ts` sets `server.host: true` + `allowedHosts: true` so the external preview hostname is accepted.
- No database or other infra services needed.

## Secrets
- `GEMINI_API_KEY` (optional): Google Gemini key for server-side AI endpoints. If absent, the app boots and AI endpoints run in a deterministic fallback mode. Get it at https://aistudio.google.com/apikey.

## Verify it works
- `curl -sf -H "Host: external-preview.example.com" http://localhost:3000/` returns the HTML shell.
- Logs should show `[VITALOS Security Hardened] Server active on http://0.0.0.0:3000`.
