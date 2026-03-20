# Legacy Express Backend

This folder contains the remaining legacy Express helper backend from the prototype.

It is **not** the target production architecture anymore. The secure baseline now lives in `server/` and uses NestJS, Prisma, PostgreSQL, backend-enforced RBAC, audit logging, and server-side duel logic.

Status:

- `/api/admin` is decommissioned and returns `410 Gone`
- `/api/push` is decommissioned and returns `410 Gone`
- Web-Push subscriptions, test-push and event delivery now belong to the NestJS notifications module
- The former Express route files for auth, admin, push and the old MySQL helper were removed from active use
- This legacy server is now only a temporary placeholder and should not be part of the production deployment
