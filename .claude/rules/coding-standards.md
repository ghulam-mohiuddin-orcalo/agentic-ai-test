---
name: coding-standards
description: Naming, structure, and code conventions for all NexusAI code
---

# Coding Standards

## File Naming

| Type | Pattern | Example |
|------|---------|---------|
| Controller | `*.controller.ts` | `models.controller.ts` |
| Service | `*.service.ts` | `models.service.ts` |
| DTO | `*.dto.ts` | `create-model.dto.ts` |
| Guard | `*.guard.ts` | `jwt-auth.guard.ts` |
| Interceptor | `*.interceptor.ts` | `logging.interceptor.ts` |
| Module | `*.module.ts` | `models.module.ts` |
| Test | `*.spec.ts` | `models.service.spec.ts` |
| React Component | `PascalCase.tsx` | `ModelCard.tsx` |
| React Page | `page.tsx` | `app/chat/page.tsx` |
| Hook | `use*.ts` | `useAuth.ts` |
| Redux Slice | `*Slice.ts` | `authSlice.ts` |
| Redux API | `*Api.ts` | `chatApi.ts` |

## Naming Conventions

- Classes: `PascalCase` (`UserService`, `AuthController`)
- Interfaces: `PascalCase` with `I` prefix (`IUser`, `IAIProvider`)
- Methods: `camelCase` (`findAll`, `createUser`)
- Constants: `UPPER_SNAKE_CASE` (`MAX_RETRIES`)
- Files: `kebab-case` (`user.service.ts`)
- React components: `PascalCase` files (`ModelCard.tsx`)

## TypeScript Rules

- Strict mode enabled
- No `any` type - use `unknown` if needed
- Explicit return types for public methods
- Interfaces for object shapes, enums for fixed values

```typescript
// Good
async findById(id: string): Promise<User> {
  return this.prisma.user.findUnique({ where: { id } });
}

// Bad
async findById(id) {
  return this.prisma.user.findUnique({ where: { id } });
}
```

## Import Order

```typescript
// 1. External packages
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

// 2. Internal (absolute)
import { PrismaService } from '@/prisma/prisma.service';

// 3. Relative
import { CreateUserDto } from './dto/create-user.dto';
```

## Error Handling

```typescript
// Use NestJS built-in exceptions
throw new NotFoundException('Model not found');
throw new BadRequestException('Invalid input');
throw new UnauthorizedException('Invalid token');
throw new ForbiddenException('Not your resource');
throw new ConflictException('Email exists');

// Never expose internals
catch (error) {
  this.logger.error('Operation failed', error.stack);
  throw new InternalServerErrorException('Operation failed');
}
```

## Async/Await

- Always async/await, never raw promises
- No floating promises (always await or void)
- Try/catch in service methods that can fail
