---
name: coding-standards
description: NestJS and TypeScript coding standards
---

# Coding Standards

## File Naming

- Controllers: `*.controller.ts`
- Services: `*.service.ts`
- DTOs: `*.dto.ts`
- Entities: `*.entity.ts`
- Guards: `*.guard.ts`
- Interceptors: `*.interceptor.ts`
- Pipes: `*.pipe.ts`
- Modules: `*.module.ts`
- Tests: `*.spec.ts`

## Naming Conventions

- Classes: PascalCase (`UserService`, `AuthController`)
- Interfaces: PascalCase with `I` prefix (`IUser`, `IConfig`)
- Functions/Methods: camelCase (`findAll`, `createUser`)
- Constants: UPPER_SNAKE_CASE (`MAX_RETRIES`, `API_VERSION`)
- Files: kebab-case (`user.service.ts`, `auth.controller.ts`)

## TypeScript

- Use strict mode
- No `any` type (use `unknown` if needed)
- Explicit return types for public methods
- Use interfaces for object shapes
- Use enums for fixed value sets
- Use type guards for narrowing

```typescript
// ✅ GOOD
async findById(id: string): Promise<User> {
  return this.prisma.user.findUnique({ where: { id } });
}

// ❌ BAD
async findById(id) {
  return this.prisma.user.findUnique({ where: { id } });
}
```

## NestJS Patterns

### Dependency Injection

```typescript
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}
}
```

### Module Organization

```typescript
@Module({
  imports: [PrismaModule, CacheModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```

### Controller Structure

```typescript
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async findAll(@Query() query: FilterUsersDto) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }
}
```

## Error Handling

```typescript
// Use NestJS exceptions
throw new NotFoundException(`User with ID ${id} not found`);
throw new BadRequestException('Invalid email format');
throw new UnauthorizedException('Invalid credentials');
throw new ForbiddenException('Insufficient permissions');
throw new ConflictException('Email already exists');

// Custom exceptions
export class ModelNotAvailableException extends HttpException {
  constructor(modelId: string) {
    super(`Model ${modelId} is not available`, HttpStatus.SERVICE_UNAVAILABLE);
  }
}
```

## Async/Await

- Always use async/await over promises
- Handle errors with try/catch
- No floating promises

```typescript
// ✅ GOOD
async createUser(dto: CreateUserDto): Promise<User> {
  try {
    return await this.prisma.user.create({ data: dto });
  } catch (error) {
    this.logger.error('Failed to create user', error);
    throw new InternalServerErrorException('User creation failed');
  }
}
```

## Comments

- Use JSDoc for public APIs
- Explain "why" not "what"
- Keep comments up to date
- No commented-out code

```typescript
/**
 * Creates a new user account with email verification
 * @param dto User registration data
 * @returns Created user without password hash
 * @throws ConflictException if email already exists
 */
async register(dto: RegisterDto): Promise<User> {
  // Implementation
}
```

## Imports

- Group imports: external → internal → relative
- Use absolute paths for src imports
- No unused imports

```typescript
// External
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

// Internal
import { PrismaService } from '@/prisma/prisma.service';
import { CacheService } from '@/cache/cache.service';

// Relative
import { CreateUserDto } from './dto/create-user.dto';
```
