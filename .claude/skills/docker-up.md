---
name: docker-up
description: Start the full NexusAI stack with Docker Compose
---

# Docker Up Skill

Starts all services (PostgreSQL, Redis, backend, frontend) via Docker Compose.

## Usage

```bash
/docker-up           # Build and start
/docker-up --build   # Force rebuild
/docker-up --down    # Stop and remove containers
/docker-up --logs    # Follow logs
```

## Steps

1. Check `docker-compose.yml` exists
2. Run appropriate docker-compose command:
   - Default: `docker-compose up -d`
   - `--build`: `docker-compose up --build -d`
   - `--down`: `docker-compose down`
   - `--logs`: `docker-compose logs -f`
3. Wait for healthchecks to pass
4. Report service status

## Service Health

After starting, verify:
- PostgreSQL: `pg_isready` or connection test
- Redis: `redis-cli ping`
- Backend: `curl http://localhost:5001/api/v1/health`
- Frontend: `curl http://localhost:3000`

## Troubleshooting

- Port conflicts: Check if 3000, 5001, 5432, 6379 are free
- Build failures: Check `npm install` output in Docker build logs
- Migration needed: Backend may need `prisma migrate deploy` on first run
