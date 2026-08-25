# Deploy (simple, free, no Docker)

Docker is **not** part of this project. You do not need to learn it for the assessment.

## What Vercel and Netlify can do

They are excellent for the **React frontend** (static files after `npm run build`).

They are **not** a MySQL server. A classic Express API is a process that stays running and talks to MySQL. Vercel/Netlify are built for static sites and short serverless functions, not for “install MySQL next to Node.”

So we split hosting:

| Piece | Free option | You click |
|---|---|---|
| React UI | **Vercel** or **Netlify** | Connect GitHub, set root folder `frontend`, build command `npm run build` |
| Express API | **Render** free Web Service (or Railway) | Connect GitHub, root `backend`, start `npm start` |
| MySQL | **Railway** MySQL, **Aiven** free MySQL, or **TiDB Cloud** (MySQL-compatible) | Create DB, copy connection URL into the API env vars |

Put the Vercel site URL in the API CORS allow-list. Put the API public URL in the frontend as `VITE_API_URL`.

## Why not “everything on Vercel”?

Possible later with serverless functions + an external MySQL, but it is fiddlier (timeouts, cold starts, seed of 10k rows). A small Render (or Railway) Node service is simpler and matches Express.

## Local development (also no Docker)

1. Install **Node.js** and **MySQL** on Windows (MySQL Installer or XAMPP/WAMP if you already use them).
2. Create a database, put the URL in `backend/.env`.
3. Run the API and `npm run dev` in `frontend`.

## When we do this

Phase 9 — after the app works on your laptop. A 2–3 minute video of the **public URL** satisfies Readiness.

## Env vars (preview)

- API: `DATABASE_URL`, `JWT_SECRET` (or equivalent), `CORS_ORIGIN`
- Frontend: `VITE_API_URL=https://your-api.onrender.com`
