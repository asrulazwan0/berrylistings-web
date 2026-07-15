# BerryListings Web

React + TypeScript frontend for the BerryListings property management platform.

## Stack

- React 19, TypeScript 6
- Vite 8 (build tool)
- React Router (client-side routing)
- Plain CSS with design tokens
- Consumes [BerryListings API](../berrylistings) (Express + Prisma)

## Quick Start

```bash
npm install
npm run dev        # http://localhost:5173
```

Backend API must be running at `http://localhost:3000` (proxied in dev).

## Docker

```bash
# From parent directory — runs backend + database + frontend
cd ..
docker compose up --build

# Frontend only
docker build -t berrylistings-web .
docker run -p 80:80 berrylistings-web
```

### Services (full stack)

| Service  | Port  | URL                        |
|----------|-------|----------------------------|
| Frontend | 5173  | http://localhost:5173      |
| Backend  | 3000  | http://localhost:3000/docs |
| MySQL    | 3307  | —                          |

## Project Structure

```
src/
  api/            Typed API client + TypeScript types
  components/     Shared components (Nav, Footer, PropertyCard, etc.)
  contexts/       React contexts (AuthContext)
  pages/          Route pages
    admin/         Admin dashboard
  styles/         CSS (tokens.css = design tokens from reference)
```

## Design Reference

The UI is built from the static HTML/CSS reference in `../berrylistings-ui/`.

## Scripts

| Command         | Purpose               |
|-----------------|-----------------------|
| `npm run dev`   | Vite dev server       |
| `npm run build` | TypeScript + Vite build|
| `npm run lint`  | oxlint                |
| `npm run preview`| Preview production build|

## Environment

No `.env` needed for the frontend. API URL is configured via Vite proxy in dev and nginx in production.
