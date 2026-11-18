# Expert Path

## What this project is
Expert Path is a discovery platform that helps technical professionals find practitioners worth following across LinkedIn, YouTube, X (Twitter), GitHub, and blogs.

It solves the problem of not knowing who to follow or what to study in domains like Kubernetes, AWS, SRE, Observability, Platform Engineering, and DevOps.

## Core features
- Curated list of tech practitioners with topics, bios, and "why follow" notes
- Search and filter by name, bio, or topic
- Detail page for each expert (click a card)
- Follow and Bookmark buttons (stored in localStorage)
- Links to LinkedIn, YouTube, X, GitHub, and personal blogs
- Resource sections: GitHub repos, Open Source foundations, Cloud providers, Learning paths
- Dark/light theme toggle
- Client-side routing (`/` and `/expert/:id`)

## Tech stack
- **Frontend**: Single HTML page with vanilla JS (served by Cloudflare Worker)
- **Deployment**: Cloudflare Worker at `expert-path.sredeepak01.workers.dev`
- **Original MVP**: Go backend + React frontend (kept in `/backend` and `/frontend` for reference)
- **Data**: In-memory expert and resource lists inside the Worker

## How to run
```bash
npx wrangler dev   # local
npx wrangler deploy
```

## Key files
- `src/index.js` — Cloudflare Worker (current live version)
- `wrangler.toml` — Worker config
- `backend/main.go` — Original Go API
- `frontend/` — Original React + Vite app

## Current live URL
https://expert-path.sredeepak01.workers.dev

## Data model (Expert)
```js
{
  id: string,
  name: string,
  topics: string[],
  bio: string,
  why_follow: string,
  linkedin?: string,
  youtube?: string,
  x?: string,
  github?: string,
  blog?: string
}
```

## API (when using original backend)
- `GET /api/experts?q=&topic=`
- `GET /api/topics`

## Notes for AI agents
- The live site is a self-contained Cloudflare Worker. Prefer editing the Worker script for UI changes.
- Follow/Bookmark state is client-side only (localStorage).
- Detail pages use client-side routing via `history.pushState`.
- Theme preference is also stored in localStorage.
