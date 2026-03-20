# Security audit: Azubi-App

## Security status

The current application is **not production-ready** for public-sector use in its original form. The active frontend still talks directly to Supabase and updates security-relevant tables from the browser. A secure server-side baseline has now been scaffolded under `server/`, but the legacy client paths must still be migrated before go-live.

## Step 1: current risks

### Critical

- `src/supabase.js`: the frontend used a hardcoded fallback Supabase URL and anon key. This normalized direct client-to-database access and removed configuration discipline.
- `src/database.js`: the legacy helper writes `password` directly into a database row. Even if unused today, this is an unsafe code path and cannot exist in a defensible codebase.
- `src/context/AuthContext.jsx`: registration, profile creation, approval-related notifications, and profile updates are driven from the browser against Supabase tables and RPCs. The browser is acting as part of the trust boundary.
- `src/App.jsx`: duel/game state, winners, and stats are written from the client. Ranking and duel outcomes can therefore be manipulated by a modified client.
- `src/components/views/AdminView.jsx`: organization management, invitation code creation, and account deletion run directly from the frontend against database tables. This is only safe if every RLS rule is perfect and permanently maintained, which is an unacceptable security posture for this use case.
- `vps-setup/coolify-compose.yml`: the repository contained hardcoded database passwords, JWT secrets, anon keys, and service-role-equivalent material. This is an immediate secret-management failure.
- The repository previously contained a legacy Express auth path with fallback-secret behavior. That code path has since been removed from the active tree, but its existence confirmed the prototype was not a defensible production baseline.

### High

- `backend/`: the repository contains an unfinished Express/MySQL backend while the live prototype uses Supabase directly. This split architecture creates ambiguity, unmaintained auth code, and deployment risk.
- `backend/`: the remaining legacy Express placeholder is decommissioned for `/api/admin` and `/api/push`, but the directory still exists and should not be part of the production deployment.
- `supabase/config.toml`: JWT verification was disabled for the `send-web-push` function. The function did its own auth check, but disabling platform JWT validation is an unnecessary weakening.
- `supabase/create_forum.sql`: forum read access is open to all authenticated users, while category restrictions are mostly left to the app. That is not a strong enough data-boundary model for role-segmented communication.
- `supabase/fix_registration.sql`: a SECURITY DEFINER function is granted to `anon` to create profiles. This may be operationally convenient, but it is a wider capability than a hardened backend design should require.

### Medium

- `DEPLOYMENT.md`: the main deployment guide still describes static frontend deployment patterns that bypass the target backend architecture.
- Logging and retention are only partially implemented in the prototype. An audit trail for administrative changes was not present in the active application path.
- Backup scripts existed for a Supabase-focused VPS setup, but restore testing and production restore procedures were not verifiable from the current codebase.

### Low

- There is no clean separation yet between legacy prototype code and the secure target path, so operator confusion remains possible until the frontend is migrated.

## IT compliance gaps

- No single authoritative backend API for security-relevant business logic.
- No production-grade secret handling in all deployment assets.
- No server-enforced RBAC for the active application path.
- No server-side validation boundary for all high-risk inputs.
- No complete audit log for admin/security actions in the active path.
- No defensible server-side duel/ranking authority.

## Production-readiness gaps

- Frontend still uses prototype-era direct database access.
- End-to-end migration to the NestJS backend is not completed yet.
- CI/CD approval gates and immutable deployment controls are not verifiable from current codebase.
- Restore drill evidence is not verifiable from current codebase.

## Step 2: remediation priorities

### Critical

- Remove hardcoded secrets and fallback production credentials.
- Move authentication, authorization, invitation handling, and approval flow into a dedicated backend.
- Move duel and ranking logic to server-side answer evaluation.
- Stop treating the browser as a privileged actor for admin operations and profile mutation.

### High

- Enforce RBAC, approval status, and validation globally in the backend.
- Sanitize chat content before persistence.
- Add Dockerized deployment with minimal published ports.
- Add audit logging for admin/security actions.

### Medium

- Replace remaining prototype Supabase direct-access paths with API calls.
- Add seed/migration workflow for organizations, invitation codes, and question bank data.
- Add integration tests for auth, RBAC, and duel scoring.

### Low

- Remove or archive the legacy Express backend once frontend migration is complete.

## Step 3: secure target architecture

- Browser -> Nginx -> NestJS API -> PostgreSQL
- Browser never talks to PostgreSQL directly.
- Access tokens are short-lived; refresh token is stored in an HttpOnly cookie.
- Account creation requires an invitation code and stays `PENDING` until approved.
- Chat scope and duel scoring are both enforced on the server.
- Sensitive actions are written to `AuditLog`.

## Step 4: implemented changes

- `server/package.json`: adds a production-oriented NestJS, Prisma, JWT, validation, sanitization, and hashing dependency set. Required for production.
- `server/prisma/schema.prisma`: defines PostgreSQL models for users, organizations, invitations, audit logs, chat, questions, duels, and duel answers. Required for production.
- `server/src/main.ts`: adds global validation, Helmet, cookie parsing, CORS, and centralized exception handling. Required for production.
- `server/src/app.module.ts`: wires a global guard stack for throttling, JWT auth, approval enforcement, and RBAC. Required for production.
- `server/src/common/*`: adds reusable security primitives such as `@Public`, `@Roles`, JWT guard, approval guard, roles guard, and audit logging. Required for production.
- `server/src/modules/auth/*`: implements invitation-based registration, argon2 password hashing, approval-aware login, refresh-token cookie handling, and password change. Required for production.
- `server/src/modules/users/*`: implements admin approval, admin role changes, and safe organization contact listing. Required for production.
- `server/src/modules/invitations/*`: moves invitation creation and revocation into the backend and stores only hashed invitation codes. Required for production.
- `server/src/modules/chat/*`: sanitizes content and enforces same-organization and apprentice/staff scope rules on the server. Required for production.
- `server/src/modules/duels/*`: ensures duel creation, acceptance, answer submission, completion, and leaderboard calculation are server-side. Required for production.
- `server/src/modules/health/*`: adds a readiness endpoint for deployment and monitoring. Recommended, but effectively required in managed operations.
- `server/Dockerfile`: provides a container build for the NestJS backend. Required for the target deployment model.
- `Dockerfile.web`: builds and serves the frontend behind Nginx. Required for the target deployment model.
- `docker/nginx/default.conf`: serves the SPA and proxies `/api/` to the backend while applying security headers. Required for production.
- `docker-compose.yml`: provides a three-service deployment with only the web tier published externally. Required for production.
- `.env.example` and `server/.env.example`: define environment-driven secrets and remove any need for checked-in credentials. Required for production.
- `ops/backup-postgres.sh` and `ops/restore-postgres.sh`: add an explicit backup/restore baseline for the PostgreSQL target. Required for production operations.
- `README.md`: replaces prototype-style deployment guidance with the secure target architecture and operating model. Required for production.

## Remaining migration work

- Replace legacy frontend Supabase table writes with calls to the new `/api` endpoints.
- Remove the remaining legacy Express placeholder directory once no operational dependency remains.
- Add automated tests for auth, approval, chat scope, and duel finalization.
- Add organization and question seed data for operational setup.

## Not verifiable from current codebase

- Formal data retention schedule approval by the operator
- Key rotation procedure and secret escrow process
- Production backup restore drill evidence
- CI/CD separation-of-duties controls
