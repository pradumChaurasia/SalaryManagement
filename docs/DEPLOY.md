# Live deployment notes

This app is verified locally via Docker Compose and is ready for a hosted deployment once you provide a cloud target and database credentials.

## Recommended target

Use a managed MySQL database plus two hosted services:

1. API service: Dockerized backend
2. Frontend service: static Vite build

## Render setup

1. Create a managed MySQL database.
2. Copy the connection string to the API service env as `DATABASE_URL`.
3. Create a web service for the backend using the Dockerfile in `backend/Dockerfile`.
4. Create a static site for the frontend using the `frontend` folder and `npm install && npm run build`.
5. Set `VITE_API_BASE_URL` to the published API URL.

## Required env vars

Backend:
- `DATABASE_URL`
- `PORT=3000`
- `AUTH_ENABLED=true`
- `AUTH_USER=admin`
- `AUTH_PASS=<strong password>`
- `AUTH_SECRET=<random secret>`

Frontend:
- `VITE_API_BASE_URL=https://<your-api-url>`

## Notes

- The backend container now runs `npx prisma migrate deploy` before startup to initialize schema changes automatically.
- The local Docker stack still uses the private port mapping from `docker-compose.yml` so it does not conflict with any existing local MySQL instance.
