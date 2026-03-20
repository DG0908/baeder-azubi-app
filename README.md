# Azubi-App

The repository was not production-ready for a municipal or public-sector deployment. A secure backend baseline now exists in `server/`, backed by NestJS, Prisma, PostgreSQL, audit logging, approval-based auth, RBAC, sanitized chat, and server-side duel scoring.

## Current status

The legacy frontend still contains direct Supabase access patterns from the prototype. Those paths should be treated as migration debt, not as the target architecture. The production baseline is:

- Frontend: React + Vite
- Backend: NestJS + TypeScript in `server/`
- Database: PostgreSQL + Prisma
- Auth: short-lived JWT access token plus HttpOnly refresh cookie
- Deployment: Docker Compose + Nginx reverse proxy

Legacy browser writes are now blocked by default in `src/supabase.js`. Do not set `VITE_ENABLE_UNSAFE_LEGACY_DB_WRITES=true` outside an isolated migration or debugging environment.

## Secure target architecture

- `web` serves the frontend and reverse-proxies `/api/*` to the backend.
- `server` is the only component allowed to talk to PostgreSQL.
- `postgres` is internal-only and not published to the internet.
- Admin-sensitive actions are written to `AuditLog`.
- Account creation is invitation-based and requires explicit approval.
- The legacy Express `/api/push` route is decommissioned; push subscriptions and push delivery belong to the NestJS notifications module.
- Duel scoring is computed server-side from submitted answers, never from client scores.
- Duel expiry reminders and status transitions are handled server-side on a scheduler, not by trusting client timers.

## Quick start

1. Copy `.env.example` to `.env` and replace every placeholder secret.
2. Copy `server/.env.example` only if you want a standalone local server setup outside Docker.
3. Configure `APP_PUBLIC_URL`, the `SMTP_*` values, the web-push values (`WEB_PUSH_*`, `VITE_WEB_PUSH_PUBLIC_KEY`), and the duel timeout values (`DUEL_REQUEST_TTL_MINUTES`, `DUEL_TURN_TTL_MINUTES`) in `server/.env` before enabling production multiplayer flows.
4. Start the stack:

```bash
docker compose up --build
```

5. Run database migrations from the server container:

```bash
docker compose exec server npx prisma migrate deploy
```

6. Seed organizations, admins, and question data before opening registration to users.

If you change the frontend theory/practical question catalog, regenerate the server-side exam assets before building the backend:

```bash
cd server
npm run exam-assets:generate
```

## Security baseline

- Do not expose PostgreSQL directly to the client.
- Do not reintroduce hardcoded secrets or fallback production keys.
- Do not trust frontend validation for approval, roles, chat scope, or duel outcomes.
- In-app notifications are authoritative; web-push is only an optional delivery channel on top of server-side notifications.
- Terminate TLS at your reverse proxy or load balancer in production.
- Keep backup and restore drills operational using `ops/backup-postgres.sh` and `ops/restore-postgres.sh`.

## Audit report

See `docs/security-audit.md` for:

- current risks in the prototype
- remediation priorities
- target architecture
- file-by-file changes and rationale

See also:

- `docs/implementation-roadmap.md` for the ordered remediation plan
- `docs/dsgvo-betriebskonzept.md` for the operating/privacy baseline
- `docs/migration-slice-auth-admin.md` for the first backend migration slice
- `docs/operations-runbook.md` for the production operations baseline
- `docs/production-go-live-checklist.md` for release/go-live gating
- `docs/AVV_SmartBaden.md` for the self-hosted AVV template basis
