---
name: devops
description: Docker, deployment, and infrastructure conventions
---

# DevOps & Infrastructure

## Docker Compose (Infrastructure Only)

Docker Compose provides **only infrastructure services** (PostgreSQL and Redis). Backend and frontend run locally via `npm run start:dev` / `npm run dev`.

```bash
docker compose up -d    # Start PostgreSQL + Redis
docker compose down     # Stop infrastructure
docker compose down -v  # Stop and delete volumes
```

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: nexusai-postgres
    ports: ["5432:5432"]
    volumes: [postgres_data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U nexusai -d nexusai"]

  redis:
    image: redis:7-alpine
    container_name: nexusai-redis
    ports: ["6379:6379"]
    volumes: [redis_data]
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://nexusai:nexusai_pass@localhost:5432/nexusai
REDIS_URL=redis://localhost:6379
JWT_SECRET=<min-32-chars>
JWT_REFRESH_SECRET=<min-32-chars>
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET=...
PINECONE_API_KEY=...
ALLOWED_ORIGINS=http://localhost:3000
PORT=5001
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001
```

## Deployment Checklist

- [ ] All env vars configured
- [ ] Migrations applied (`prisma migrate deploy`)
- [ ] Redis connection tested
- [ ] Health endpoint responding (`/api/v1/health`)
- [ ] CORS origins match frontend URL
- [ ] Rate limiting configured
- [ ] SSL/TLS certificates installed
- [ ] Database backups configured

## Health Endpoint

Must implement in backend:
```typescript
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
```
