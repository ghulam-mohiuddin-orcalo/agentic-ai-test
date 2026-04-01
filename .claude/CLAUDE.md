# NexusAI Backend - Claude Code Configuration

## Project Overview

NexusAI backend built with NestJS - AI model marketplace and chat platform with agent builder capabilities.

## Tech Stack

- **Framework**: NestJS 10 + TypeScript
- **Database**: PostgreSQL 16 + Prisma ORM
- **Cache**: Redis 7
- **Vector DB**: Pinecone
- **Storage**: AWS S3
- **Queue**: Bull + Redis
- **Auth**: JWT + Passport
- **Real-time**: Socket.IO
- **AI SDKs**: OpenAI, Anthropic, Google AI

## Architecture Principles

1. **Modular Design**: Feature-based modules (auth, chat, models, agents, users)
2. **Dependency Injection**: Use NestJS DI container
3. **Type Safety**: Strict TypeScript, Prisma types, DTOs with class-validator
4. **Separation of Concerns**: Controllers → Services → Repositories
5. **Error Handling**: Global exception filters, custom exceptions
6. **Security First**: Guards, interceptors, rate limiting, input validation

## Project Structure

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/          # JWT, login, register, API keys
│   │   ├── chat/          # Conversations, messages, streaming
│   │   ├── models/        # Model catalog, filters, reviews
│   │   ├── agents/        # Agent CRUD, deployment, tools
│   │   ├── users/         # User management, preferences
│   │   ├── usage/         # Analytics, tracking, billing
│   │   └── search/        # Search, suggestions, filters
│   ├── common/
│   │   ├── guards/        # Auth, roles, rate-limit
│   │   ├── interceptors/  # Logging, transform, timeout
│   │   ├── filters/       # Exception handling
│   │   ├── decorators/    # Custom decorators
│   │   └── pipes/         # Validation pipes
│   ├── config/            # Environment, database, redis
│   ├── prisma/            # Schema, migrations, seed
│   └── main.ts
├── test/
└── .env
```

## Coding Standards

### NestJS Patterns

**Controllers**: Thin, handle HTTP only
```typescript
@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Get()
  async findAll(@Query() query: FilterModelsDto) {
    return this.modelsService.findAll(query);
  }
}
```

**Services**: Business logic, reusable
```typescript
@Injectable()
export class ModelsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}
}
```

**DTOs**: Validation with class-validator
```typescript
export class CreateAgentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  systemPrompt: string;

  @IsArray()
  @IsOptional()
  tools?: ToolConfig[];
}
```

### Database

- Use Prisma for all DB operations
- Transactions for multi-step operations
- Soft deletes where applicable
- Indexes on frequently queried fields
- Use `select` to avoid over-fetching

### API Design

- RESTful conventions: GET, POST, PUT, DELETE
- Versioning: `/api/v1/`
- Pagination: `?page=1&limit=20`
- Filtering: `?provider=openai&minRating=4`
- Sorting: `?sortBy=rating&order=desc`
- Response format: `{ data, meta, error }`

### Error Handling

```typescript
throw new NotFoundException('Model not found');
throw new BadRequestException('Invalid input');
throw new UnauthorizedException('Invalid token');
```

### Security

- Validate all inputs with DTOs
- Sanitize user content
- Rate limit endpoints (10 req/min for chat, 100 req/min for reads)
- Hash passwords with bcrypt
- Sign JWTs with RS256
- CORS whitelist
- Helmet for headers
- Never log sensitive data

## Module Guidelines

### Auth Module
- JWT access (15m) + refresh tokens (7d)
- API key generation with prefix `nxai_`
- Password requirements: min 8 chars, 1 upper, 1 number
- Email verification flow
- Rate limit: 5 login attempts per 15min

### Chat Module
- Stream responses via Socket.IO
- Store messages in batches
- Support multimodal inputs (text, image, file)
- Model switching mid-conversation
- Conversation soft delete (retain 30 days)

### Models Module
- Cache model list (TTL 1h)
- Aggregate ratings on write
- Filter by: provider, price, rating, license, tags
- Paginate results (default 20 per page)

### Agents Module
- Validate tool schemas (JSON Schema)
- Store vector embeddings in Pinecone
- Deploy to unique endpoints: `/agents/:id/invoke`
- Test mode before deployment
- Version control for agent configs

### Usage Module
- Track: tokens, cost, latency, model_id, user_id
- Aggregate daily/monthly stats
- Queue analytics jobs (Bull)
- Export usage reports

## AI Integration

### Model Router Service
```typescript
@Injectable()
export class ModelRouterService {
  async chat(modelId: string, messages: Message[]) {
    const model = await this.getModel(modelId);
    const provider = this.getProvider(model.provider);
    return provider.chat(messages, model.config);
  }
}
```

### Streaming
- Use Socket.IO for bidirectional streaming
- Emit chunks: `socket.emit('chat:chunk', { delta })`
- Handle errors: `socket.emit('chat:error', { message })`
- Complete: `socket.emit('chat:done', { usage })`

### Provider Adapters
- Abstract interface for all providers
- Normalize responses to common format
- Handle rate limits and retries
- Log usage for billing

## Performance

- Cache frequently accessed data (models, user preferences)
- Use Redis for session storage
- Database connection pooling
- Lazy load relations
- Background jobs for heavy tasks (analytics, embeddings)
- CDN for static assets

## Testing

- Unit tests: Services, utilities (Jest)
- Integration tests: Controllers, DB operations
- E2E tests: Critical flows (auth, chat, agent creation)
- Mock external APIs (OpenAI, Anthropic)
- Test coverage target: 80%

## Environment Variables

```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET=...
PINECONE_API_KEY=...
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
```

## Development Workflow

1. Create feature branch: `feature/module-name`
2. Generate module: `nest g module modules/feature`
3. Create service, controller, DTOs
4. Write Prisma schema changes
5. Run migration: `npx prisma migrate dev`
6. Implement business logic
7. Write tests
8. Update API docs
9. PR with description

## Common Commands

```bash
# Development
npm run start:dev

# Generate module
nest g module modules/feature
nest g service modules/feature
nest g controller modules/feature

# Prisma
npx prisma migrate dev --name description
npx prisma generate
npx prisma studio

# Testing
npm run test
npm run test:e2e
npm run test:cov

# Build
npm run build
npm run start:prod
```

## Agents & Skills

### When to Use Agents

- **Explore Agent**: Understanding existing codebase structure, finding related files
- **Plan Agent**: Designing new features, refactoring strategies
- **General Agent**: Complex multi-file changes, research tasks

### Skills to Create

- `/migrate`: Run Prisma migrations and generate client
- `/seed`: Seed database with sample data
- `/test-module`: Run tests for specific module
- `/api-doc`: Generate/update API documentation

## Rules for Claude

1. **Always read before edit**: Use Read tool on files before modifying
2. **Type safety**: Ensure all DTOs, services, controllers are properly typed
3. **Validation first**: Add class-validator decorators to all DTOs
4. **Error handling**: Use NestJS exceptions, never throw generic Error
5. **Prisma patterns**: Use transactions for multi-step DB operations
6. **Security checks**: Validate auth on protected routes, sanitize inputs
7. **Test coverage**: Write tests for new services and controllers
8. **Documentation**: Add JSDoc comments to public methods
9. **Environment vars**: Never hardcode secrets, use ConfigService
10. **Performance**: Consider caching, pagination, and query optimization

## Anti-Patterns to Avoid

- ❌ Business logic in controllers
- ❌ Direct Prisma calls in controllers
- ❌ Unvalidated user inputs
- ❌ Synchronous heavy operations (use queues)
- ❌ N+1 queries (use Prisma `include` wisely)
- ❌ Exposing internal errors to clients
- ❌ Missing error handling
- ❌ Hardcoded configuration
- ❌ Circular dependencies between modules
- ❌ Missing indexes on queried fields

## API Response Standards

### Success Response
```typescript
{
  data: T,
  meta?: {
    page: number,
    limit: number,
    total: number
  }
}
```

### Error Response
```typescript
{
  statusCode: number,
  message: string,
  error: string,
  timestamp: string,
  path: string
}
```

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Redis connection tested
- [ ] S3 bucket permissions set
- [ ] API keys for AI providers added
- [ ] CORS origins whitelisted
- [ ] Rate limiting configured
- [ ] Logging and monitoring enabled
- [ ] Health check endpoint working
- [ ] SSL certificates installed

---

**Last Updated**: 2026-04-01
**Maintainer**: Senior Full-Stack Team
**NestJS Version**: 10.x
**Node Version**: 22.x
