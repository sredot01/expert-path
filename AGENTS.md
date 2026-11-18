# Agent instructions for Expert Path

This repository is a tech expert discovery platform.

## Purpose
Help developers find who to follow and what to study across Kubernetes, AWS, SRE, Observability, Platform Engineering, and related topics.

## Current architecture
The production version is a single Cloudflare Worker that serves a complete HTML/JS UI. Expert data lives inside the Worker script.

## When making changes
1. Prefer updating the Worker (`src/index.js` or the deployed script) for UI and data changes.
2. Keep the professional light/dark theme.
3. Maintain client-side routing for detail pages (`/expert/:id`).
4. Keep Follow and Bookmark working via localStorage.
5. Do not remove the header navigation or resource sections unless explicitly asked.

## Live site
https://expert-path.sredeepak01.workers.dev

## Repo owner
sredot01
