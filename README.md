# Tech Experts Discovery - MVP

A simple MVP for discovering tech practitioners (Kubernetes, AWS, SRE, Observability, Platform Engineering, etc.) across LinkedIn, YouTube, X, GitHub, and blogs.

## Stack

- **Backend**: Go (net/http) — in-memory data for MVP
- **Frontend**: React + Vite

## Run locally

### 1. Backend

```bash
cd backend
go run main.go
```

Runs on http://localhost:8080

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Opens on http://localhost:5173

The frontend proxies `/api` calls to the backend.

## What it does

- Lists curated experts with topics, short bio, and "why follow"
- Search by name / bio / topics
- Filter by topic
- Direct links to their LinkedIn, YouTube, X, GitHub, or blog

## Next steps for a real version

- Move data to a database (Postgres)
- Add authentication / contribution flow
- Better expertise signals (content volume, recency, community validation)
- Learning path suggestions
- Admin UI for curation
- Deploy backend on AWS (ECS/EKS or Lambda) and frontend on S3 + CloudFront

This is intentionally minimal so you can run it in minutes and decide if the idea is worth expanding.
