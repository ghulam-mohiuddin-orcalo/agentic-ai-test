# Agentic Workflow System — NexusAI Implementation Brief

> Build a JIRA MCP-powered agentic workflow system inside the existing NexusAI platform.
> Every piece of code must match the existing project patterns exactly.

---

## You Are Building Inside NexusAI

This is the **NexusAI** project — a full-stack AI marketplace and chat platform. You are adding a new `workflow` module to the existing codebase. You must use the exact same patterns, dependencies, folder structure, and conventions already in place. Nothing new or foreign.

### Exact Stack (already installed, do not change versions)

| Layer | What's Installed | Version |
|-------|-----------------|---------|
| Runtime | Node 22 + TypeScript | ^5.9.3 |
| Backend Framework | @nestjs/common, @nestjs/core, @nestjs/platform-express | ^10.4.22 |
| ORM | @prisma/client + prisma CLI | ^5.0.0 |
| Database | PostgreSQL 16 (via Docker Compose) | postgres:16-alpine |
| Cache | Redis 7 (via Docker Compose) — installed but not yet wired | redis:7-alpine |
| Auth | @nestjs/jwt + @nestjs/passport + passport-jwt + bcryptjs | ^10.0.0 |
| Validation | class-validator ^0.14.0 + class-transformer ^0.5.1 | — |
| WebSocket | @nestjs/websockets + @nestjs/platform-socket.io + socket.io | ^10.0.0 |
| API Docs | @nestjs/swagger | ^7.4.2 |
| Rate Limiting | @nestjs/throttler (100 req/60s) | ^5.0.0 |
| Queues | @nestjs/bull + bull ^4.11.0 (installed, not wired) | — |
| Caching | @nestjs/cache-manager + cache-manager ^5.2.0 (installed, not wired) | — |
| Security | helmet ^7.0.0 | — |
| Frontend | next 16.2.2 + react 19.2.4 + react-dom 19.2.4 | — |
| UI | @mui/material ^6.5.0 + @mui/icons-material ^6.5.0 + @emotion/react + @emotion/styled | — |
| State | @reduxjs/toolkit ^2.11.2 + react-redux ^9.2.0 | — |
| Forms | react-hook-form ^7.72.0 + @hookform/resolvers + zod ^3.25.76 | — |
| Charts | recharts ^2.15.4 | — |
| Notifications | notistack ^3.0.2 | — |
| Dates | date-fns ^3.6.0 | — |
| Real-time | socket.io-client ^4.8.3 | — |

### Existing Folder Structure (where new code goes)

```
E:\ORCALO\agentic-ai-test\
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # 8 models, 3 enums — you add Workflow models here
│   ├── src/
│   │   ├── main.ts                # Helmet, CORS, ValidationPipe, /api/v1 prefix
│   │   ├── app.module.ts          # Root module — register WorkflowModule here
│   │   ├── prisma/
│   │   │   ├── prisma.module.ts   # Global module
│   │   │   └── prisma.service.ts  # PrismaClient with retry-based connection
│   │   ├── common/decorators/
│   │   │   └── current-user.decorator.ts  # @CurrentUser('id') extracts from JWT
│   │   └── modules/
│   │       ├── auth/              # JwtModule, PassportModule, JwtStrategy
│   │       │   ├── guards/jwt-auth.guard.ts
│   │       │   ├── strategies/jwt.strategy.ts
│   │       │   ├── dto/index.ts   # barrel export pattern
│   │       │   ├── auth.controller.ts
│   │       │   ├── auth.service.ts
│   │       │   └── auth.module.ts
│   │       ├── agents/            # Agent CRUD, deploy, test (simulated)
│   │       │   ├── dto/index.ts
│   │       │   ├── agents.controller.ts
│   │       │   ├── agents.service.ts
│   │       │   └── agents.module.ts
│   │       ├── chat/              # Conversations, messages, WebSocket gateway
│   │       │   ├── gateway/chat.gateway.ts
│   │       │   ├── dto/index.ts
│   │       │   ├── chat.controller.ts
│   │       │   ├── chat.service.ts
│   │       │   └── chat.module.ts
│   │       ├── models/            # Model catalog, filtering, reviews
│   │       ├── users/             # Profile, password, API keys
│   │       ├── usage/             # Token tracking, stats
│   │       ├── health/            # Health endpoint
│   │       └── workflow/          # ← NEW MODULE YOU ARE BUILDING
│   ├── .env                       # Existing env vars (add JIRA vars here)
│   ├── tsconfig.json              # ES2021, commonjs, @/* path alias
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/                   # Next.js App Router pages
│   │   │   ├── chat/page.tsx
│   │   │   ├── agents/page.tsx
│   │   │   ├── marketplace/page.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── ...
│   │   ├── components/            # React components grouped by feature
│   │   │   ├── chat/
│   │   │   ├── agents/
│   │   │   ├── marketplace/
│   │   │   └── ...
│   │   ├── hooks/useAuth.ts
│   │   ├── lib/
│   │   │   ├── socket.ts          # Socket.IO singleton
│   │   │   ├── theme.ts          # MUI theme (Terracotta #C86222A primary)
│   │   │   └── constants.ts
│   │   └── store/
│   │       ├── index.ts           # configureStore
│   │       ├── hooks.ts           # useAppSelector, useAppDispatch
│   │       ├── api/
│   │       │   ├── baseApi.ts     # RTK Query with Bearer token
│   │       │   ├── authApi.ts
│   │       │   └── chatApi.ts
│   │       └── slices/
│   │           ├── authSlice.ts   # localStorage-backed
│   │           ├── chatSlice.ts
│   │           └── uiSlice.ts
│   └── .env.local                 # NEXT_PUBLIC_API_URL, NEXT_PUBLIC_WS_URL
├── docker-compose.yml             # postgres:16-alpine + redis:7-alpine
└── .env                           # Root env template
```

### Existing Prisma Schema (you are extending this)

```prisma
// backend/prisma/schema.prisma — currently has these models:
User       → id (cuid), email (unique), passwordHash, name, role (USER|ADMIN), preferences (Json)
ApiKey     → id, userId, key (unique, bcrypt-hashed), name, lastUsed
Conversation → id, userId, modelId, title, messages[]
Message    → id, conversationId, role (SYSTEM|USER|ASSISTANT), content (Text), attachments (Json)
Model      → id, name, provider, description (Text), contextWindow (Int), pricing (Json), rating (Float), tags (String[]), status (ACTIVE|BETA|DEPRECATED)
Review     → id, modelId, userId, rating (Int 1-5), comment — unique on [modelId, userId]
Agent      → id, userId, name, systemPrompt (Text), tools (Json), memoryConfig (Json), endpoint (unique), templateId, isDeployed (Boolean)
Usage      → id, userId, modelId, promptTokens, completionTokens, totalTokens, cost (Float), timestamp

// All models use: @id @default(cuid()), createdAt DateTime @default(now()), updatedAt DateTime @updatedAt
// All relations use onDelete: Cascade where appropriate
// Indexes use @@index([...]) for common query patterns
```

### Exact Patterns You Must Copy

**Controller pattern** (from `agents.controller.ts`):
```typescript
// Every controller uses these exact imports and decorators:
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Workflow')
@ApiBearerAuth()
@Controller('workflow')
@UseGuards(JwtAuthGuard)
export class WorkflowController { ... }
```

**Service pattern** (from `agents.service.ts`):
```typescript
// Services inject PrismaService, use NestJS exceptions, ownership checks:
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AgentsService {
  constructor(private readonly prisma: PrismaService) {}
  // Methods use this.prisma.model.findMany/create/update/delete
  // Ownership: if (agent.userId !== userId) throw new NotFoundException(...)
}
```

**DTO pattern** (from `create-agent.dto.ts`):
```typescript
import { IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAgentDto {
  @ApiProperty({ example: 'Customer Support Agent' })
  @IsString()
  @IsNotEmpty()
  name: string;
  // ...
}
```

**Module pattern** (from `agents.module.ts`):
```typescript
import { Module } from '@nestjs/common';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';

@Module({
  controllers: [AgentsController],
  providers: [AgentsService],
  exports: [AgentsService],
})
export class AgentsModule {}
```

**DTO barrel export** (from `agents/dto/index.ts`):
```typescript
export * from './create-agent.dto';
export * from './update-agent.dto';
export * from './test-agent.dto';
```

**Main.ts** (existing — endpoints will be at `/api/v1/workflow/*`):
```typescript
// Already configured: Helmet, CORS (ALLOWED_ORIGINS), ValidationPipe (whitelist + forbidNonWhitelisted + transform)
// API prefix: app.setGlobalPrefix('api/v1')
// Swagger at: /api/docs
```

---

## Goal

Build a JIRA MCP-powered agentic workflow system where:

1. User provides a JIRA ticket ID via `POST /api/v1/workflow/trigger`
2. System fetches the ticket via a JIRA MCP server
3. An Orchestrator Agent (using OpenAI/Anthropic LLM) analyzes the ticket
4. Work is split into backend tasks and frontend tasks
5. Specialized agents generate actual code files following NexusAI patterns
6. Results stored in PostgreSQL (via Prisma) and returned as JSON

---

## What to Build

### New Folder Structure

```
backend/src/modules/workflow/
├── workflow.module.ts
├── workflow.controller.ts
├── workflow.service.ts
├── orchestrator/
│   ├── orchestrator.service.ts    # @Injectable, uses LLM to classify tasks
│   └── prompts.ts                 # LLM prompt templates
├── agents/
│   ├── base.agent.ts              # Abstract class + interfaces
│   ├── backend.agent.ts           # Generates NestJS code
│   ├── frontend.agent.ts          # Generates Next.js code
│   └── agent-registry.ts          # Map<type, BaseAgent>
├── mcp/
│   ├── mcp-client.ts              # Generic MCP client
│   ├── jira.provider.ts           # JIRA-specific MCP provider
│   └── mcp.types.ts               # IMCPProvider, JiraTicket interfaces
└── dto/
    ├── index.ts                   # Barrel export
    ├── trigger-workflow.dto.ts
    └── workflow-query.dto.ts
```

### 1. MCP Integration Layer

**`mcp/mcp.types.ts`** — Interfaces:
```typescript
export interface IMCPProvider {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getTicket(ticketId: string): Promise<JiraTicket>;
}

export interface JiraTicket {
  id: string;
  key: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: string;
  labels: string[];
  assignee: string | null;
}
```

**`mcp/jira.provider.ts`** — Implements `IMCPProvider`:
- `@Injectable()` NestJS service
- Reads config from `ConfigService`: `JIRA_MCP_SERVER_URL`, `JIRA_DOMAIN`, `JIRA_EMAIL`, `JIRA_API_TOKEN`
- Connects to JIRA MCP server via stdio or HTTP transport
- `getTicket()` fetches ticket details and maps to `JiraTicket` interface
- Retry with exponential backoff (3 retries, 1s/2s/4s delays)
- On 4xx errors → throw immediately, on 5xx/timeout → retry
- Use `ServiceUnavailableException` from `@nestjs/common` on final failure

**`mcp/mcp-client.ts`** — Generic MCP client wrapper:
- Manages the MCP server connection lifecycle
- Handles stdio transport to the JIRA MCP server process
- Spawns the MCP server as a child process if needed
- Parses MCP protocol responses (JSON-RPC 2.0)

### 2. Agent System

**`agents/base.agent.ts`** — Abstract base:
```typescript
export interface IAgentTask {
  id: string;
  type: 'backend' | 'frontend';
  title: string;
  description: string;
  priority: number;
  dependencies: string[];
}

export interface IGeneratedFile {
  path: string;              // Relative to project root, e.g. "backend/src/modules/..."
  content: string;
  action: 'create' | 'modify' | 'delete';
}

export interface IAgentResult {
  taskId: string;
  status: 'completed' | 'failed' | 'partial';
  files: IGeneratedFile[];
  summary: string;
  errors: string[];
}

export abstract class BaseAgent {
  abstract get type(): 'backend' | 'frontend';
  abstract execute(task: IAgentTask, context: IWorkflowContext): Promise<IAgentResult>;
}
```

**`agents/backend.agent.ts`** — Generates NestJS code:
- Extends `BaseAgent`, `@Injectable()`
- Injects `PrismaService` for reading existing schema
- Uses LLM (OpenAI/Anthropic) to generate code based on task description
- **Must generate code that matches existing patterns exactly**:
  - Controllers: `@Controller`, `@UseGuards(JwtAuthGuard)`, `@ApiTags`, `@ApiBearerAuth`, thin methods calling service
  - Services: `@Injectable()`, inject `PrismaService`, use NestJS exceptions, ownership checks
  - DTOs: `class-validator` decorators (`@IsString`, `@IsNotEmpty`, etc.), `@ApiProperty` for Swagger
  - Modules: Import controller + service, export service
  - Prisma schema: `@id @default(cuid())`, `@db.Text` for long strings, `@@index()` for query fields
- File paths follow the convention: `backend/src/modules/[module-name]/[file-name].ts`

**`agents/frontend.agent.ts`** — Generates Next.js code:
- Extends `BaseAgent`, `@Injectable()`
- Uses LLM to generate React/Next.js code
- **Must generate code that matches existing frontend patterns**:
  - Pages: `page.tsx` in `frontend/src/app/[route]/` directory
  - Components: `PascalCase.tsx` in `frontend/src/components/[feature]/`
  - `'use client'` only when component uses state, effects, or browser APIs
  - MUI components (`Box`, `Stack`, `Paper`, `Card`, `Button`, etc.) + Tailwind utilities
  - Forms: `react-hook-form` + `zod` via `@hookform/resolvers/zod`
  - State: RTK Query for server data (extend `baseApi.ts`), Redux slices for UI state
  - Theme: Terracotta `#C86222A` primary, Instrument Sans body, Syne headings
- API base URL: `process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1'`
- Socket.IO via `frontend/src/lib/socket.ts`

**`agents/agent-registry.ts`** — Extensible registry:
```typescript
@Injectable()
export class AgentRegistry {
  private agents = new Map<string, BaseAgent>();
  register(agent: BaseAgent): void { this.agents.set(agent.type, agent); }
  get(type: string): BaseAgent { /* throw BadRequestException if not found */ }
  list(): string[] { return [...this.agents.keys()]; }
}
// Future: register QAAgent, DevOpsAgent, SecurityAgent the same way
```

### 3. Orchestrator

**`orchestrator/orchestrator.service.ts`** — `@Injectable()`:
- Injects `PrismaService`, `JiraMCPProvider`
- Uses OpenAI or Anthropic API (via existing `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` env vars) to classify tasks
- Sends ticket title + description + acceptance criteria to the LLM
- LLM prompt instructs classification into backend/frontend tasks with knowledge of the NexusAI stack
- Creates `Workflow` + `WorkflowTask` records in the database
- Returns the structured plan

**`orchestrator/prompts.ts`** — LLM prompt templates:
```
You are analyzing a JIRA ticket for the NexusAI platform.

Stack: NestJS 10 backend (Prisma ORM, PostgreSQL, class-validator DTOs, JWT auth)
       Next.js 16 frontend (React 19, MUI 6, Redux Toolkit, react-hook-form + zod)

Classify each requirement:

BACKEND = API endpoints, database schema (Prisma), services, controllers, DTOs,
          guards, middleware, WebSocket events, Redis caching, Bull queues.
FRONTEND = React components, Next.js pages (App Router), Redux state/RTK Query,
           MUI components, Tailwind styles, forms, Socket.IO client.

Output strictly JSON:
{
  "backend": [{ "title": "...", "description": "...", "priority": 1-5 }],
  "frontend": [{ "title": "...", "description": "...", "priority": 1-5 }]
}
```

### 4. Workflow Service & Controller

**`workflow.service.ts`** — `@Injectable()`:
- Injects `PrismaService`, `OrchestratorService`, `AgentRegistry`, NestJS `Logger`
- `triggerWorkflow(userId, ticketId, options)` — fetch ticket, orchestrate, optionally execute
- `executeWorkflow(workflowId, userId)` — run all tasks with dependency ordering (topological sort)
- `retryTask(workflowId, taskId)` — re-run a single failed task
- Ownership verification on every method (check `workflow.userId === userId`, throw `ForbiddenException`)
- Dual logging: NestJS `Logger` to console + `WorkflowLog` records to database
- Status transitions: PENDING → ANALYZING → PLANNED → EXECUTING → COMPLETED/FAILED

**`workflow.controller.ts`** — REST endpoints at `/api/v1/workflow`:

| Method | Route | Purpose |
|--------|-------|---------|
| POST | /workflow/trigger | Fetch ticket + orchestrate + optionally execute |
| GET | /workflow | List user's workflows (paginated) |
| GET | /workflow/:id | Get workflow status + tasks + results |
| POST | /workflow/:id/execute | Execute a planned/dry-run workflow |
| POST | /workflow/:id/tasks/:taskId/retry | Retry a failed task |

All endpoints: `@UseGuards(JwtAuthGuard)`, `@CurrentUser('id')` for userId, Swagger decorators.

**`workflow.module.ts`** — Wires everything:
```typescript
import { Module } from '@nestjs/common';
import { WorkflowController } from './workflow.controller';
import { WorkflowService } from './workflow.service';
import { OrchestratorService } from './orchestrator/orchestrator.service';
import { JiraMCPProvider } from './mcp/jira.provider';
import { BackendAgent } from './agents/backend.agent';
import { FrontendAgent } from './agents/frontend.agent';
import { AgentRegistry } from './agents/agent-registry';

@Module({
  controllers: [WorkflowController],
  providers: [
    WorkflowService,
    OrchestratorService,
    JiraMCPProvider,
    BackendAgent,
    FrontendAgent,
    AgentRegistry,
    {
      provide: 'REGISTER_AGENTS',
      useFactory: (registry: AgentRegistry, backend: BackendAgent, frontend: FrontendAgent) => {
        registry.register(backend);
        registry.register(frontend);
        return registry;
      },
      inject: [AgentRegistry, BackendAgent, FrontendAgent],
    },
  ],
  exports: [WorkflowService],
})
export class WorkflowModule {}
```

**Register in `app.module.ts`**:
```typescript
import { WorkflowModule } from './modules/workflow/workflow.module';
// Add to imports array
```

**Add to `main.ts` Swagger config**:
```typescript
.addTag('Workflow', 'JIRA-powered agentic workflow system')
```

### 5. Database Schema Additions

Append to `backend/prisma/schema.prisma`:

```prisma
model Workflow {
  id          String         @id @default(cuid())
  userId      String
  ticketKey   String
  ticketTitle String
  ticketData  Json
  status      WorkflowStatus @default(PENDING)
  config      Json?
  tasks       WorkflowTask[]
  logs        WorkflowLog[]
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([status])
  @@map("workflows")
}

model WorkflowTask {
  id           String     @id @default(cuid())
  workflowId   String
  type         AgentType
  title        String
  description  String     @db.Text
  priority     Int        @default(3)
  status       TaskStatus @default(PENDING)
  dependencies String[]
  result       Json?
  error        String?
  startedAt    DateTime?
  completedAt  DateTime?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  workflow Workflow @relation(fields: [workflowId], references: [id], onDelete: Cascade)

  @@index([workflowId])
  @@index([type])
  @@map("workflow_tasks")
}

model WorkflowLog {
  id         String   @id @default(cuid())
  workflowId String
  level      LogLevel @default(INFO)
  message    String
  metadata   Json?
  timestamp  DateTime @default(now())

  workflow Workflow @relation(fields: [workflowId], references: [id], onDelete: Cascade)

  @@index([workflowId])
  @@map("workflow_logs")
}

enum WorkflowStatus {
  PENDING
  ANALYZING
  PLANNED
  EXECUTING
  COMPLETED
  FAILED
  CANCELLED
}

enum AgentType {
  BACKEND
  FRONTEND
}

enum TaskStatus {
  PENDING
  RUNNING
  COMPLETED
  FAILED
  SKIPPED
}

enum LogLevel {
  DEBUG
  INFO
  WARN
  ERROR
}
```

Add relation to existing `User` model:
```prisma
model User {
  // ... existing fields
  workflows Workflow[]   // ← add this line
}
```

Then run:
```bash
cd backend && npx prisma migrate dev --name add-workflow-system
cd backend && npx prisma generate
```

### 6. Environment Variables

Append to `backend/.env`:
```env
# JIRA MCP Integration
JIRA_MCP_SERVER_URL=http://localhost:3001
JIRA_DOMAIN=your-domain.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-jira-api-token

# Workflow Config
WORKFLOW_MAX_RETRIES=3
WORKFLOW_TIMEOUT_MS=300000

# LLM keys already exist in .env:
# OPENAI_API_KEY=
# ANTHROPIC_API_KEY=
```

### 7. CLI Interface

Create `backend/src/cli/workflow-cli.ts`:
```bash
# Usage:
cd backend
npx ts-node -r tsconfig-paths/register src/cli/workflow-cli.ts NEXUS-42
npx ts-node -r tsconfig-paths/register src/cli/workflow-cli.ts NEXUS-42 --dry-run
npx ts-node -r tsconfig-paths/register src/cli/workflow-cli.ts NEXUS-42 --agent backend --write
```

The CLI should:
1. Bootstrap NestJS application context (just `WorkflowModule` + `PrismaModule` + `ConfigModule`)
2. Accept `ticketId` as first positional argument
3. Accept optional `--dry-run` (plan only, no execution)
4. Accept optional `--agent backend|frontend` (run only one agent type)
5. Accept optional `--write` (write generated files to disk)
6. Accept optional `--user-id` (defaults to a system user)
7. Print colored console output showing each step
8. Exit with code 0 on success, 1 on failure

### 8. Logging

Use NestJS `Logger` (already used in `PrismaService`):
```typescript
private readonly logger = new Logger(WorkflowService.name);

// Dual log: console + database
private async log(workflowId: string, level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR', message: string, metadata?: Record<string, unknown>): Promise<void> {
  this.logger[level.toLowerCase() as 'log' | 'warn' | 'error'](message);
  await this.prisma.workflowLog.create({
    data: { workflowId, level, message, metadata: metadata ?? undefined },
  });
}
```

---

## Implementation Order

Build in this exact sequence:

### Phase 1: Schema & Database
1. Add Workflow, WorkflowTask, WorkflowLog models + 4 enums to `prisma/schema.prisma`
2. Add `workflows Workflow[]` relation to existing `User` model
3. Run `npx prisma migrate dev --name add-workflow-system && npx prisma generate`

### Phase 2: MCP Integration
4. Create `mcp/mcp.types.ts` — IMCPProvider, JiraTicket interfaces
5. Create `mcp/mcp-client.ts` — Generic MCP client with JSON-RPC 2.0
6. Create `mcp/jira.provider.ts` — JIRA-specific provider with retry logic

### Phase 3: Agent System
7. Create `agents/base.agent.ts` — Abstract class + IAgentTask, IAgentResult, IGeneratedFile
8. Create `agents/agent-registry.ts` — Map-based registry with register/get/list
9. Create `agents/backend.agent.ts` — NestJS code generator (follows existing controller/service/DTO/module patterns)
10. Create `agents/frontend.agent.ts` — Next.js code generator (follows existing page/component/store patterns)

### Phase 4: Orchestrator
11. Create `orchestrator/prompts.ts` — LLM classification prompt template
12. Create `orchestrator/orchestrator.service.ts` — Fetch ticket via MCP, call LLM, create DB records

### Phase 5: Workflow Engine
13. Create `dto/trigger-workflow.dto.ts` + `dto/workflow-query.dto.ts` + `dto/index.ts`
14. Create `workflow.service.ts` — triggerWorkflow, executeWorkflow, retryTask
15. Create `workflow.controller.ts` — REST endpoints with Swagger docs
16. Create `workflow.module.ts` — Wire all providers, register agents

### Phase 6: Integration
17. Update `app.module.ts` — Import `WorkflowModule`
18. Update `main.ts` — Add `'Workflow'` tag to Swagger `DocumentBuilder`
19. Add env vars to `backend/.env`

### Phase 7: CLI
20. Create `src/cli/workflow-cli.ts` — Terminal interface

### Phase 8: Tests
21. Create `workflow.service.spec.ts` — Unit tests with Jest
22. Create `workflow.controller.spec.ts` — Integration tests with `@nestjs/testing`

---

## Example Output

```bash
$ cd backend && npx ts-node -r tsconfig-paths/register src/cli/workflow-cli.ts NEXUS-42

[Nest] 12  - 04/05/2026  LOG [WorkflowService] Fetching JIRA ticket NEXUS-42...
[Nest] 12  - 04/05/2026  LOG [JiraMCPProvider] Connected to JIRA MCP server
[Nest] 12  - 04/05/2026  LOG [WorkflowService] Ticket fetched: "Add user notification preferences"

[Nest] 12  - 04/05/2026  LOG [OrchestratorService] Analyzing ticket with LLM...
[Nest] 12  - 04/05/2026  LOG [OrchestratorService] Classification complete: 3 backend, 3 frontend tasks

=== Task Breakdown ===

  Backend Tasks:
    1. [P1] Add NotificationPreferences model to Prisma schema
    2. [P2] Create GET/PUT /users/me/notification-preferences endpoints
    3. [P2] Create NotificationPreferencesDto with class-validator

  Frontend Tasks:
    1. [P1] Create NotificationSettings component (MUI Toggle + react-hook-form)
    2. [P2] Add notificationPrefs endpoints to RTK Query (baseApi)
    3. [P1] Integrate into /settings page (App Router) under Notifications tab

[Nest] 12  - 04/05/2026  LOG [WorkflowService] Executing backend tasks...

  [BE-1] prisma/schema.prisma (modified)
         Added NotificationPreferences model with userId, email, push, sms fields
  [BE-2] modules/users/users.controller.ts (modified)
         Added GET /users/me/notification-preferences
         Added PUT /users/me/notification-preferences
  [BE-3] modules/users/dto/notification-preferences.dto.ts (created)
         GetNotificationPreferencesDto, UpdateNotificationPreferencesDto

[Nest] 12  - 04/05/2026  LOG [WorkflowService] Executing frontend tasks...

  [FE-1] components/settings/NotificationSettings.tsx (created)
         MUI Card with Toggle switches, react-hook-form + zod validation
  [FE-2] store/api/notificationPrefsApi.ts (created)
         useGetNotificationPreferencesQuery, useUpdateNotificationPreferencesMutation
  [FE-3] app/settings/page.tsx (modified)
         Added Notifications tab to existing MUI Tabs component

=== Result ===
  Workflow: clxxxx1234 (NEXUS-42)
  Status: COMPLETED
  Tasks: 6/6 succeeded

=== Generated Files ===
  backend/prisma/schema.prisma                            [modified]
  backend/src/modules/users/users.controller.ts           [modified]
  backend/src/modules/users/users.service.ts              [modified]
  backend/src/modules/users/dto/notification-preferences.dto.ts  [created]
  frontend/src/components/settings/NotificationSettings.tsx      [created]
  frontend/src/store/api/notificationPrefsApi.ts                 [created]
  frontend/src/app/settings/page.tsx                            [modified]

=== Next Steps ===
  1. cd backend && npx prisma migrate dev --name add-notification-preferences
  2. cd backend && npm run start:dev
  3. cd frontend && npm run dev
  4. Open http://localhost:3000/settings → Notifications tab
```

---

## Code Quality Rules (Non-Negotiable)

- **TypeScript**: No `any`. Use `unknown` if needed. Explicit return types on public methods.
- **NestJS patterns**: Controllers are thin (delegate to service). Services hold business logic. PrismaService for all DB access.
- **DTOs**: Every DTO uses `class-validator` decorators. Every field has `@ApiProperty` for Swagger. Barrel-exported from `dto/index.ts`.
- **Error handling**: Use `NotFoundException`, `BadRequestException`, `ForbiddenException`, `ServiceUnavailableException` from `@nestjs/common`. Never expose internals. Log errors with `this.logger.error()`.
- **Security**: All endpoints protected with `@UseGuards(JwtAuthGuard)`. Ownership checks: `if (workflow.userId !== userId) throw new ForbiddenException()`.
- **Naming**: Classes `PascalCase`, interfaces `I` prefix (`IAgentTask`), methods `camelCase`, files `kebab-case`, components `PascalCase.tsx`.
- **Imports**: External packages first (`@nestjs/common`), then internal absolute (`@/prisma/...`), then relative (`./dto`).
- **Prisma**: All models use `@id @default(cuid())`, `@@index()` for query fields, `@db.Text` for long strings, `@@map("snake_case")` for table names.
- **Frontend**: `'use client'` only when needed. Server components by default. MUI + Tailwind. RTK Query for API calls. react-hook-form + zod for forms.

---

## Extensibility

The `BaseAgent` + `AgentRegistry` pattern allows adding new agent types by:
1. Creating a new class that extends `BaseAgent`
2. Implementing `type` getter and `execute()` method
3. Registering in `workflow.module.ts` factory

Future agents:
- `QAAgent` — generates `.spec.ts` test files for generated code
- `DevOpsAgent` — generates Docker/CI configs
- `SecurityAgent` — audits generated code against OWASP top 10

No architectural changes needed — just add the class and register it.
