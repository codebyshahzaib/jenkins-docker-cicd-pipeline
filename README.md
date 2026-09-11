# Release Room

Release Room is a full-screen delivery dashboard for the Jenkins CI/CD assignment. It is a small production-shaped application with a Vite frontend, a Node.js API, and an Nginx gateway running as separate Compose services.

## Architecture

```text
Browser -> Nginx web container -> /api/* -> Node API container
                    |
                    -> compiled Vite assets
```

- `frontend/` contains the Vite dashboard, frontend package manifest, Nginx config, and multi-stage image.
- `backend/` contains the Node API, package manifest, and API image.
- `docker-compose.yml` connects the two services and exposes only the web gateway.
- `sonar-project.properties` scans `frontend/src`.

## Run locally

Requires Node.js 22 or newer.

Each app owns its environment data. The real `.env` files are ignored; use the committed examples when setting up a new checkout:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

Frontend variables must use the `VITE_` prefix because Vite exposes them to browser code. Backend variables stay server-side.

```bash
cd frontend
npm ci
npm run dev
```

The Vite development server runs at `http://localhost:5173`. Start the API in a second terminal with:

```bash
cd backend
npm start
```

## Run with Docker Compose

```bash
docker compose up --build
```

Open `http://localhost:8081`.

Stop the services with `docker compose down`.

## Validation

```bash
cd frontend && npm run build
docker compose config --quiet
docker compose build
```

The Jenkins pipeline remains the CI/CD orchestration layer for multi-SCM checkout, SonarQube, Docker image creation, deployment, and notifications.
