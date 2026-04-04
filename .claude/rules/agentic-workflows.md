---
name: agentic-workflows
description: Standard workflows combining agents and skills for common task types
---

# Agentic Workflows

Quick-reference for which agents and skills to chain for each task type.

## Available Agents

| Agent | Type | Purpose |
|-------|------|---------|
| `feature-planner` | plan | Break features into agent-executable tasks |
| `database-expert` | general | Schema, migrations, query optimization |
| `backend-architect` | plan | Module/API surface design |
| `api-builder` | general | Implement controllers, services, DTOs |
| `ai-provider` | general | OpenAI/Anthropic/Google integration |
| `frontend-dev` | general | React/Next.js pages and components |
| `security-auditor` | general | Security review |
| `test-writer` | general | Unit, integration, e2e tests |
| `devops` | general | Docker, CI/CD, deployment |

## Available Skills

| Skill | Purpose |
|-------|---------|
| `/migrate [name]` | Prisma migrate + generate |
| `/seed [--reset]` | Seed database |
| `/test-module <name>` | Run module tests |
| `/api-doc [--serve]` | Swagger docs |
| `/lint` | ESLint + Prettier |
| `/docker-up` | Start full stack |

## Workflow 1: New Full-Stack Feature

```
feature-planner (plan)
  → database-expert (schema)     ─┐
  → backend-architect (design)   ─┤ parallel
  → /migrate [name]              ─┘
  → api-builder (implement)      ─┐ parallel
  → frontend-dev (UI)            ─┘
  → test-writer (tests)
  → security-auditor (review)
  → /test-module [name]
```

## Workflow 2: Backend-Only Feature

```
database-expert (schema)
  → /migrate [name]
  → backend-architect (design)
  → api-builder (implement)
  → test-writer (tests)
  → /test-module [name]
```

## Workflow 3: Schema-Only Change

```
database-expert (schema)
  → /migrate [name]
  → /seed [--reset]
  → test-writer (adjust impacted tests)
```

## Workflow 4: Frontend-Only Feature

```
frontend-dev (directly)
  → /lint
```

## Workflow 5: AI Provider Integration

```
ai-provider (providers + router)
  → test-writer (mock provider tests)
  → security-auditor (API key handling)
```

## Workflow 6: Bug Fix

```
api-builder OR frontend-dev (directly, no planning needed)
  → /test-module [affected-module]
```

## Workflow 7: Security Hardening

```
security-auditor (full review)
  → database-expert (query patterns)
  → test-writer (auth/validation tests)
  → /test-module auth --coverage
```

## Workflow 8: Performance Optimization

```
database-expert (hotspot analysis)
  → backend-architect (caching/queue strategy)
  → api-builder (implement optimizations)
  → test-writer (regression tests)
```

## Workflow 9: Docker/Deploy

```
devops (directly)
  → /docker-up (test locally)
```

## Routing Heuristic

- **Single module, no schema change?** → Skip planner, go direct to specialist
- **Cross-module or new feature?** → Start with feature-planner
- **Only frontend?** → frontend-dev directly
- **Only database?** → database-expert directly
- **Security concern?** → security-auditor directly
