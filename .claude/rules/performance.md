---
name: performance
description: Performance optimization patterns for database, caching, and API
---

# Performance Rules

## Database

### Indexes
```prisma
model Example {
  // ...
  @@index([email])              // single field
  @@index([userId, createdAt])  // composite for common queries
}
```

### Avoid N+1
```typescript
// Bad: N+1
const users = await prisma.user.findMany();
for (const u of users) u.posts = await prisma.post.findMany({ where: { userId: u.id } });

// Good: Single query
const users = await prisma.user.findMany({ include: { posts: true } });
```

### Select Only Needed Fields
```typescript
const users = await prisma.user.findMany({
  select: { id: true, email: true, name: true },
});
```

### Transactions
```typescript
await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: userData });
  await tx.profile.create({ data: { userId: user.id } });
});
```

## Caching

```typescript
async findAll() {
  const cached = await this.cache.get('models:all');
  if (cached) return cached;

  const data = await this.prisma.model.findMany();
  await this.cache.set('models:all', data, 3600); // 1 hour
  return data;
}

// Invalidate on write
async update(id: string, dto: UpdateDto) {
  const result = await this.prisma.model.update({ where: { id }, data: dto });
  await this.cache.del('models:all');
  await this.cache.del(`model:${id}`);
  return result;
}
```

## Pagination

```typescript
async findAll(query: { page: number; limit: number }) {
  const { page = 1, limit = 20 } = query;
  const [data, total] = await Promise.all([
    this.prisma.model.findMany({ skip: (page - 1) * limit, take: limit }),
    this.prisma.model.count(),
  ]);
  return { data, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
}
```

## Background Jobs (Bull)

```typescript
// Queue heavy work
@Processor('analytics')
export class AnalyticsProcessor {
  @Process('aggregate')
  async handleAggregate(job: Job) { /* heavy computation */ }
}

// Add to queue
await this.analyticsQueue.add('aggregate', { userId, date });
```

## Rate Limiting

```typescript
// Global: 100 req/min
ThrottlerModule.forRoot({ ttl: 60, limit: 100 });

// Strict: auth endpoints
@Throttle(5, 900) // 5 req per 15 min

// Moderate: chat
@Throttle(10, 60) // 10 req per min
```
