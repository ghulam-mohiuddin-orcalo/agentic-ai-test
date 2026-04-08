---
name: security
description: Security rules for authentication, validation, data protection, and API safety
---

# Security Rules

## Authentication

```typescript
// JWT config
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

// Password hashing
const hash = await bcrypt.hash(password, 10); // min 10 rounds

// API key generation
const key = `nxai_${randomBytes(32).toString('hex')}`;
const stored = await bcrypt.hash(key, 10); // hash before storing
```

## Input Validation

```typescript
// Every DTO must have class-validator decorators
export class CreateUserDto {
  @IsEmail() @IsNotEmpty()
  email: string;

  @IsString() @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d)/, { message: 'Need uppercase + number' })
  password: string;

  @IsString() @MaxLength(100)
  name: string;
}
```

## Authorization

```typescript
// Guards on protected routes
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController { /* ... */ }

// Resource ownership check
if (conversation.userId !== userId) {
  throw new ForbiddenException('Not your resource');
}
```

## Rate Limiting

| Endpoint | Limit |
|----------|-------|
| Auth (login/register) | 5 req / 15 min |
| Chat | 10 req / min |
| General reads | 100 req / min |

## Error Handling (Never Expose Internals)

```typescript
// Bad: exposes details
catch (error) { throw new Error(error.message); }

// Good: generic message, log details
catch (error) {
  this.logger.error(error.stack);
  throw new InternalServerErrorException('Operation failed');
}
```

## Data Protection

- Never return password hashes in responses
- API keys shown only once (on creation)
- No secrets in logs (log token prefix only)
- Helmet middleware for security headers
- CORS whitelist (not `*`)

## SQL Injection Prevention

```typescript
// Bad
await prisma.$queryRaw(`SELECT * FROM users WHERE email = '${input}'`);

// Good
await prisma.user.findUnique({ where: { email: input } });

// Good (raw with params)
await prisma.$queryRaw`SELECT * FROM users WHERE email = ${input}`;
```

## Security Checklist

- [ ] JWT tokens properly signed and verified
- [ ] All DTOs validated with class-validator
- [ ] Passwords hashed with bcrypt (10+ rounds)
- [ ] Protected routes use guards
- [ ] Resource mutations verify ownership
- [ ] Rate limiting configured
- [ ] CORS whitelist (not `*`)
- [ ] Helmet middleware active
- [ ] No secrets in code or logs
- [ ] Generic error messages to clients
- [ ] Dependencies audited (`npm audit`)
