# Expert Path

Discover tech practitioners worth following across LinkedIn, YouTube, X, GitHub, and blogs.

## Stack

- **Cloudflare Worker** — API + static assets
- **React + Vite** frontend
- Original Go backend kept in `/backend` for reference

## Local development

```bash
# Install dependencies
npm install
cd frontend && npm install && cd ..

# Build frontend
npm run build

# Run locally with Wrangler
npx wrangler dev
```

## Deploy to Cloudflare

```bash
npx wrangler deploy
```

Or connect the repo in the Cloudflare dashboard — the `wrangler.toml` makes the Deploy button work.

## API

- `GET /api/experts?q=search&topic=Kubernetes`
- `GET /api/topics`
