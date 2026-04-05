# NexusAI - Master AI Agent Orchestrator

> Enterprise-grade multi-agent system for the NexusAI AI marketplace and chat platform.
> This file is the brain that routes every task to the right agent with minimal tokens.

## Project Identity

**NexusAI** = Full-stack AI marketplace + chat platform + agent builder.
- **Backend**: NestJS 10 + TypeScript + Prisma + PostgreSQL + Redis + Socket.IO
- **Frontend**: Next.js 16 + React 19 + Redux Toolkit + MUI + Tailwind
- **Infra**: Docker Compose for infrastructure only (PostgreSQL 16, Redis 7)

## Agent Routing Table (READ FIRST)

When you receive a task, match it to the correct flow below. Do NOT read all files - route immediately.

| Task Type | Route To | Token Cost |
|-----------|----------|------------|
| JIRA ticket (any) | `/jira <KEY>` — auto-classifies and routes | Auto |
| New feature (full-stack or backend) | `feature-planner` → `database-expert` → `backend-architect` → `api-builder` → `test-writer` → `security-auditor` | High |
| New feature (frontend only) | `frontend-dev` directly | Medium |
| Bug fix (specific file/endpoint) | `api-builder` or `frontend-dev` directly | Low |
| Schema change / new model | `database-expert` → `/migrate` | Low |
| API endpoint (CRUD) | `api-builder` directly | Low |
| AI provider integration | `ai-provider` directly | Medium |
| Security concern / audit | `security-auditor` directly | Medium |
| Performance issue | `database-expert` → `backend-architect` | Medium |
| Tests for existing code | `test-writer` directly | Low |
| Docker / CI / deploy | `devops` directly | Low |
| Code review / refactor | `simplify` skill or `api-builder` | Low |
| Exploration / understanding | Use Explore agent (built-in) | Low |

## Optimal Agent Flow (Recommended)

```
                    ┌─────────────────┐
                    │  User Request   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  CLAUDE.md      │ ◄── Routes task
                    │  (Orchestrator) │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼──────┐      │      ┌───────▼────────┐
     │ Is it a new   │      │      │ Is it a fix/   │
     │ feature/epic? │      │      │ small change?  │
     └────┬──┬───────┘      │      └───────┬────────┘
          │  │              │              │
     YES  │  │         EXPLORE        YES  │
          │  │              │              │
   ┌──────▼──▼──┐    ┌──────▼──────┐  ┌───▼────────────┐
   │feature-    │    │ Use built-in│  │ Route directly  │
   │planner     │    │ Explore     │  │ to specialist   │
   │(Plan agent)│    │ agent       │  │ agent           │
   └──────┬─────┘    └─────────────┘  └────────────────┘
          │
   ┌──────▼─────────────────────────────────┐
   │ PARALLEL EXECUTION (where possible):   │
   │                                        │
   │  ┌─────────────────┐  ┌─────────────┐ │
   │  │ database-expert │  │ backend-    │ │
   │  │ (schema+indexes)│  │ architect   │ │
   │  └────────┬────────┘  │ (module     │ │
   │           │           │  design)    │ │
   │           │           └──────┬──────┘ │
   │           └──────┬───────────┘        │
   │                  ▼                    │
   │          ┌──────────────┐             │
   │          │  /migrate    │             │
   │          └──────┬───────┘             │
   │                 ▼                     │
   │          ┌──────────────┐             │
   │          │  api-builder │             │
   │          │  (implement) │             │
   │          └──────┬───────┘             │
   │                 │                     │
   │        ┌────────┴────────┐            │
   │        ▼                 ▼            │
   │  ┌───────────┐   ┌───────────────┐   │
   │  │test-writer│   │frontend-dev   │   │
   │  │(tests)    │   │(if fullstack) │   │
   │  └─────┬─────┘   └───────┬───────┘   │
   │        └────────┬────────┘            │
   │                 ▼                     │
   │          ┌──────────────┐             │
   │          │security-     │             │
   │          │auditor       │             │
   │          └──────┬───────┘             │
   │                 ▼                     │
   │          ┌──────────────┐             │
   │          │  /test-module│             │
   │          └──────────────┘             │
   └───────────────────────────────────────┘
```

## Agent Registry

### Backend Agents
| Agent | Type | When | Key Rule Files |
|-------|------|------|----------------|
| `feature-planner` | plan | New feature/epic | `rules/project-map.md` |
| `database-expert` | general-purpose | Schema, migrations, queries | `rules/performance.md` |
| `backend-architect` | plan | Module design, API surface | `rules/coding-standards.md` |
| `api-builder` | general-purpose | Implement endpoints/services/DTOs | `rules/coding-standards.md`, `rules/security.md` |
| `ai-provider` | general-purpose | OpenAI/Anthropic/Google integration | `rules/ai-integration.md` |
| `security-auditor` | general-purpose | Security review | `rules/security.md` |
| `test-writer` | general-purpose | Tests | `rules/coding-standards.md` |

### Frontend Agent
| Agent | Type | When | Key Rule Files |
|-------|------|------|----------------|
| `frontend-dev` | general-purpose | React/Next.js pages, components, state | `rules/frontend-standards.md` |

### Infrastructure Agent
| Agent | Type | When | Key Rule Files |
|-------|------|------|----------------|
| `devops` | general-purpose | Docker, CI/CD, deployment | `rules/devops.md` |

## Skill Registry

| Skill | Purpose | When |
|-------|---------|------|
| `/jira <TICKET-KEY>` | JIRA ticket → branch → implement → review → PR | New ticket work |
| `/migrate [name]` | Prisma migrate + generate | After schema changes |
| `/seed [--reset]` | Seed database | After migrations, for dev data |
| `/test-module <name>` | Run module tests | After implementation |
| `/api-doc [--serve]` | Swagger docs | After API changes |
| `/lint` | ESLint + Prettier | Before commits |
| `/docker-up` | Start infrastructure (PostgreSQL + Redis) | Local development |

## Token Optimization Rules

1. **Route, don't explore**: Use the routing table above. Don't read 20 files to understand what's already documented here.
2. **Read target files only**: When implementing, read only the file you're modifying + its DTOs.
3. **Single agent per task**: Don't invoke multiple agents for simple changes. One specialist is enough.
4. **Skip planning for obvious tasks**: CRUD endpoint, bug fix, or component update = go directly to the implementer.
5. **Parallel when independent**: Schema design + frontend work can run in parallel.
6. **Reuse rule files**: Agents should reference rule files, not duplicate their content.

## Project Structure (Quick Reference)

```
backend/src/
├── main.ts                    # Entry: Helmet, CORS, ValidationPipe, /api/v1 prefix
├── app.module.ts              # Root module
├── prisma/                    # PrismaService (global)
├── common/decorators/         # @CurrentUser
└── modules/
    ├── auth/                  # JWT register/login/refresh, guards, strategies
    ├── chat/                  # Conversations, messages, WebSocket gateway
    ├── models/                # Model catalog, filtering, reviews
    ├── agents/                # Agent CRUD, deploy, test (simulated)
    ├── users/                 # Profile, password, API keys
    └── usage/                 # Token tracking, stats

frontend/src/
├── app/                       # Next.js App Router pages
│   ├── login/                 # Auth pages
│   ├── register/
│   ├── chat/                  # Chat interface with streaming
│   ├── agents/                # Agent builder
│   ├── marketplace/           # Model marketplace
│   └── discover/              # AI research feed
├── components/                # React components by feature
├── hooks/                     # Custom hooks (useAuth)
├── lib/                       # Utilities, constants, mock data
└── store/                     # Redux Toolkit (authSlice, chatSlice, uiSlice)
```

## Database Schema (Quick Reference)

```
User ──< ApiKey
User ──< Conversation ──< Message
User ──< Agent
User ──< Review
User ──< Usage
Model ──< Conversation
Model ──< Review
Model ──< Usage
```

## Known Gaps (Priority Order)

1. **No real AI provider integration** - ChatGateway and AgentsService responses are simulated
2. **No seed file** - `prisma/seed.ts` missing, marketplace has no backend data
3. **No migrations** - Only schema.prisma exists, no migrations/ folder
4. **No health endpoint** - `/api/v1/health` referenced but doesn't exist
5. **No tests** - Zero test files in the project
6. **Redis unused** - Installed but not configured in app.module.ts
7. **S3 unused** - Dependency declared but no code uses it
8. **Socket auth token mismatch** - Client reads `token` key but auth stores `nexusai_token`
9. **Hardcoded frontend data** - Chat sidebar and marketplace don't fetch from backend
10. **Missing pages** - /profile, /settings, /forgot-password referenced but don't exist

## Commands

```bash
# Development (run backend and frontend separately)
cd backend && npm run start:dev
cd frontend && npm run dev

# Infrastructure (Docker)
docker compose up -d            # Start PostgreSQL + Redis
docker compose down             # Stop infrastructure
docker compose down -v          # Stop and delete volumes

# Database
cd backend && npx prisma migrate dev --name <desc>
cd backend && npx prisma generate
cd backend && npx prisma studio

# Testing
cd backend && npm test
cd backend && npm run test:e2e
```

## Golden Rules

1. **Read before edit** - Always use Read tool before modifying any file
2. **Type safety** - All DTOs need class-validator decorators, all methods need return types
3. **NestJS pattern** - Controllers are thin, services have business logic, Prisma for DB
4. **Security first** - Validate inputs, use guards, never expose internals, no secrets in code
5. **Token efficiency** - Route to specialist agents, don't re-read what's documented here

---

**Last Updated**: 2026-04-05
**Stack**: NestJS 10 / Next.js 16 / Node 22 / PostgreSQL 16 / Redis 7
