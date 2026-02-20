# Security & Credentials Checklist

This file lists all required server-side credentials, where to get them, and secure handling instructions. Do NOT store any secret values in version control. Follow these steps to avoid leaking keys.

## Required environment variables (server-side only)

- `SUPABASE_URL` — Supabase project URL (Dashboard → Project). Example: `https://xyz.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` — Service Role key (Dashboard → Settings → API → Service role key). SERVER-ONLY. Never expose to clients.
- `DATABASE_URL` — Postgres connection string used by Prisma (Dashboard → Database → Connection string).
- `JWT_SECRET` — Strong random secret used to sign JWTs. Generate with: `openssl rand -hex 64`.
- `JWT_EXPIRES_IN` — Token lifetime, e.g. `1h` (optional, defaults in config).
- `FRONTEND_URL` — Allowed frontend origin for CORS, e.g. `https://app.example.com` or `http://localhost:3000`.
- `PORT` — Server port (optional).
- `ENABLE_CRON` — `true|false` to enable example cron jobs (optional).
- `LOG_LEVEL` — `debug|info|warn|error` (optional).

Copy `./.env.example` to `./.env` and fill these values locally, or set them securely in your production host (see below).

## Where to get keys in Supabase

1. Open Supabase Dashboard for your project.
2. Project URL: visible in the project header (copy it to `SUPABASE_URL`).
3. Service Role key: Dashboard → Settings → API → Service role. Copy `service_role` to `SUPABASE_SERVICE_ROLE_KEY`.
4. Database connection string: Dashboard → Database → Connection string. Use for `DATABASE_URL`.

## CORS / FRONTEND origin handling

- The backend reads `FRONTEND_URL` from env and allows only that origin via CORS (see `src/app.js`).
- For local development: set `FRONTEND_URL=http://localhost:3000`.
- For multiple allowed origins, consider adding a small whitelist check in `src/app.js` and parsing a comma-separated env var.

## Supabase Row Level Security (RLS)

- Enable RLS on all tables to prevent direct client access: Table Editor → (table) → Security → Enable RLS.
- Initially, do NOT create permissive public policies. With RLS enabled and no public policies, client requests are denied by default.
- The server uses `SUPABASE_SERVICE_ROLE_KEY` to perform privileged operations (service role bypasses RLS). Keep that key server-only.
- Example SQL snippets (run in Supabase SQL editor):

```sql
-- enable RLS
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;

-- example policy if you later allow clients to read their own row
CREATE POLICY "Users can select their own row"
  ON public."User"
  FOR SELECT
  USING (auth.uid() = id);
```

Note: design how Supabase Auth `user.id` maps to your `User.id` in Prisma before enabling client-facing policies.

## Where the code references these variables

- Supabase client (server-only): [src/config/supabase.js](src/config/supabase.js)
- App config loader: [src/config/index.js](src/config/index.js)
- CORS setup: [src/app.js](src/app.js)
- Prisma schema: [prisma/schema.prisma](prisma/schema.prisma)
- Server bootstrap and cron: [src/server.js](src/server.js)

## Deployment / secure storage options

- Do NOT commit `.env` to git. Add `.env` to `.gitignore` (already done).
- Use your hosting provider's secret manager (e.g., DigitalOcean App Platform, Vercel, AWS Secrets Manager, Heroku config vars, or Docker secrets).
- For PM2, prefer `ecosystem.config.js` with environment variables set via your CI/CD or use `pm2 start ecosystem.config.js --env production` where production env vars are provided by the host.
- Example with PM2 ecosystem (do not hardcode secrets): use your CI to inject env or use cloud provider env features.

## Prisma migrations & commands

- Generate client: `npx prisma generate` or `npm run prisma:generate`.
- Run migrations (production): `npm run migrate` (calls `prisma migrate deploy`).

## Run & monitoring commands

Development:
```bash
npm install
npm run prisma:generate
npm run migrate
npm run dev
```

Production (PM2):
```bash
pm2 start ecosystem.config.js --env production
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 logs secure-backend
```

## Logging & security best practices

- Never log raw secrets (especially `SUPABASE_SERVICE_ROLE_KEY` or `DATABASE_URL`).
- Winston logs are written to `src/logs/*` (see `src/utils/logger.js`). Ensure log files are protected with filesystem permissions in production.
- Watch for failed login attempts — the app logs these via Winston.

## Emergency rotation checklist

If a secret is accidentally exposed:
1. Rotate the secret in Supabase (Dashboard → Settings → API), update server env, and restart the server.
2. Rotate DB credentials if needed and run `prisma migrate` if schema changed.

## Quick reminders

- Never give `SUPABASE_SERVICE_ROLE_KEY` to the frontend.
- Enable RLS on all tables.
- Keep all business logic server-side.
- Use strong `JWT_SECRET` and do not share it.

If you want, I can also add a small script to validate that required env vars are present at startup and fail fast if any are missing.
