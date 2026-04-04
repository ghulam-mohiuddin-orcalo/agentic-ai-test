---
name: devops
description: Docker, deployment, and infrastructure conventions
---

# DevOps & Infrastructure

## Docker Compose Services

```yaml
services:
  postgres:
    image: postgres:16-alpine
    ports: ["5432:5432"]
    volumes: [postgres_data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    volumes: [redis_data]
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]

  backend:
    build: ./backend
    ports: ["5001:5001"]
    depends_on:
      postgres: { condition: service_healthy }
      redis: { condition: service_healthy }

  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    depends_on: [backend]
```

## Backend Dockerfile Rules

- Base: `node:22-alpine`
- Copy `package*.json` and `prisma/` first (layer caching)
- Run `npm ci` then `npx prisma generate`
- Copy source, build with `npm run build`
- Run migrations on startup (entrypoint script)
- Expose port 5001

## Frontend Dockerfile Rules

- Base: `node:22-alpine`
- Multi-stage: deps → build → production
- Use `next.config.ts` with `output: 'standalone'`
- Non-root user: `nextjs:nodejs`
- Copy standalone output + public + static assets

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/nexusai
REDIS_URL=redis://redis:6379
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
