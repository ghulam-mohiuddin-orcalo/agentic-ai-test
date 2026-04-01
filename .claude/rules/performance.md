---
name: performance
description: Performance optimization guidelines
---

# Performance Guidelines

## Database Optimization

### Use Indexes

```prisma
model User {
  id    String @id
  email String @unique
  name  String

  @@index([email])
  @@index([createdAt])
}
```

### Avoid N+1 Queries

```typescript
// ❌ BAD: N+1 query
const users = await prisma.user.findMany();
for (const user of users) {
  user.posts = await prisma.post.findMany({ where: { userId: user.id } });
}

// ✅ GOOD: Single query with include
const users = await prisma.user.findMany({
  include: { posts: true },
});
```

### Select Only Needed Fields

```typescript
// ❌ BAD: Fetches all fields
const users = await prisma.user.findMany();

// ✅ GOOD: Select specific fields
const users = await prisma.user.findMany({
  select: { id: true, email: true, name: true },
});
```

### Use Transactions

```typescript
await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: userData });
  await tx.profile.create({ data: { userId: user.id, ...profileData } });
});
```

## Caching Strategy

### Cache Frequently Accessed Data

```typescript
@Injectable()
export class ModelsService {
  async findAll(): Promise<Model[]> {
    const cacheKey = 'models:all';

    // Check cache
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    // Fetch from DB
    const models = await this.prisma.model.findMany();

    // Cache for 1 hour
    await this.cache.set(cacheKey, models, 3600);

    return models;
  }
}
```

### Cache Invalidation

```typescript
async update(id: string, dto: UpdateModelDto): Promise<Model> {
  const model = await this.prisma.model.update({
    where: { id },
    data: dto,
  });

  // Invalidate cache
  await this.cache.del('models:all');
  await this.cache.del(`model:${id}`);

  return model;
}
```

## API Response Optimization

### Pagination

```typescript
async findAll(query: PaginationDto) {
  const { page = 1, limit = 20 } = query;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    this.prisma.model.findMany({ skip, take: limit }),
    this.prisma.model.count(),
  ]);

  return {
    data,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}
```

### Compression

```typescript
// main.ts
import compression from 'compression';

app.use(compression());
```

## Background Jobs

### Use Queues for Heavy Tasks

```typescript
@Injectable()
export class AgentService {
  constructor(
    @InjectQueue('agents') private agentQueue: Queue,
  ) {}

  async deploy(id: string): Promise<void> {
    // Queue deployment job
    await this.agentQueue.add('deploy', { agentId: id });
  }
}

// Processor
@Processor('agents')
export class AgentProcessor {
  @Process('deploy')
  async handleDeploy(job: Job) {
    const { agentId } = job.data;
    // Heavy deployment logic
  }
}
```

## Streaming

### Stream Large Responses

```typescript
@Get('export')
async export(@Res() res: Response) {
  const stream = await this.service.exportData();

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=export.json');

  stream.pipe(res);
}
```

## Connection Pooling

```typescript
// Prisma connection pool
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  connection_limit = 10
}
```

## Monitoring

### Add Performance Logging

```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        console.log(`Request took ${duration}ms`);
      }),
    );
  }
}
```

## Rate Limiting

```typescript
// Global rate limit
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
    }),
  ],
})
export class AppModule {}

// Endpoint-specific
@Throttle(10, 60) // 10 requests per minute
@Post('chat')
async chat(@Body() dto: ChatDto) {
  return this.chatService.chat(dto);
}
```
