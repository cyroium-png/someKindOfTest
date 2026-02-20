# Secure Node + Supabase Backend

Production-ready Node.js backend using Supabase (server-only) and Prisma.

Prerequisites:
- Node.js (LTS >=18)
- PostgreSQL (or Supabase-managed DB)

Quick start

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies:

```bash
npm install
```

3. Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run migrate
```

4. Start in production with PM2:

```bash
pm2 start ecosystem.config.js
pm2 monit
```

PM2 log rotation

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:compress true
```

Nginx reverse proxy example

```
server {
  listen 80;
  server_name api.example.com;

  location / {
    proxy_pass http://127.0.0.1:4000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Let's Encrypt (certbot) example

```bash
sudo apt update && sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.example.com
```

.env example is included in `.env.example`.

Security notes
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to clients.
- Enable Row Level Security (RLS) on all Supabase tables and create policies.

See the repository files for implementation details.
