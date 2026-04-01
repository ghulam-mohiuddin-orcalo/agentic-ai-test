---
name: security
description: Security best practices and guidelines
---

# Security Rules

## Authentication

### JWT Configuration

```typescript
// Use strong secrets (min 32 chars)
JWT_SECRET=your-256-bit-secret-key-here
JWT_REFRESH_SECRET=your-256-bit-refresh-secret-key-here

// Token expiration
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
```

### Password Security

```typescript
import * as bcrypt from 'bcrypt';

// Hash password (min 10 rounds)
const SALT_ROUNDS = 10;
const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword);
```

### API Key Generation

```typescript
import { randomBytes } from 'crypto';

// Generate secure API key
const apiKey = `nxai_${randomBytes(32).toString('hex')}`;

// Hash before storing
const hashedKey = await bcrypt.hash(apiKey, 10);
```

## Input Validation

### Always Validate DTOs

```typescript
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain uppercase and number',
  })
  password: string;

  @IsString()
  @MaxLength(100)
  name: string;
}
```

### Sanitize HTML Inputs

```typescript
import * as sanitizeHtml from 'sanitize-html';

const clean = sanitizeHtml(userInput, {
  allowedTags: [],
  allowedAttributes: {},
});
```

### File Upload Validation

```typescript
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
async upload(@UploadedFile() file: Express.Multer.File) {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowedTypes.includes(file.mimetype)) {
    throw new BadRequestException('Invalid file type');
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new BadRequestException('File too large');
  }

  // Validate file content (not just extension)
  // Use file-type library for magic number validation
}
```

## Authorization

### Route Guards

```typescript
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  deleteUser(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
```

### Resource Ownership

```typescript
async updateConversation(userId: string, conversationId: string, dto: UpdateDto) {
  const conversation = await this.prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  // Verify ownership
  if (conversation.userId !== userId) {
    throw new ForbiddenException('Not authorized to update this conversation');
  }

  return this.prisma.conversation.update({
    where: { id: conversationId },
    data: dto,
  });
}
```

## Rate Limiting

### Global Configuration

```typescript
// app.module.ts
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100, // 100 requests per minute
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
```

### Endpoint-Specific Limits

```typescript
// Strict limit for auth endpoints
@Throttle(5, 900) // 5 requests per 15 minutes
@Post('login')
async login(@Body() dto: LoginDto) {
  return this.authService.login(dto);
}

// Moderate limit for chat
@Throttle(10, 60) // 10 requests per minute
@Post('chat')
async chat(@Body() dto: ChatDto) {
  return this.chatService.chat(dto);
}
```

## CORS Configuration

```typescript
// main.ts
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

## Security Headers

```typescript
import helmet from 'helmet';

// main.ts
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
  },
}));
```

## Environment Variables

### Never Commit Secrets

```bash
# .gitignore
.env
.env.local
.env.*.local
```

### Use ConfigService

```typescript
@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  async signToken(payload: any) {
    const secret = this.configService.get<string>('JWT_SECRET');
    return jwt.sign(payload, secret);
  }
}
```

## Error Handling

### Don't Expose Internal Details

```typescript
// ❌ BAD: Exposes stack trace
catch (error) {
  throw new InternalServerErrorException(error.message);
}

// ✅ GOOD: Generic message, log details
catch (error) {
  this.logger.error('Database operation failed', error.stack);
  throw new InternalServerErrorException('Operation failed');
}
```

### Custom Exception Filter

```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // Log full error server-side
    this.logger.error(exception);

    // Send generic error to client
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: status === 500 ? 'Internal server error' : exception.message,
    });
  }
}
```

## Logging

### Never Log Sensitive Data

```typescript
// ❌ BAD: Logs password
this.logger.log(`User login: ${email}, ${password}`);

// ✅ GOOD: Logs only non-sensitive data
this.logger.log(`User login attempt: ${email}`);

// ❌ BAD: Logs full token
this.logger.log(`Generated token: ${token}`);

// ✅ GOOD: Logs token prefix only
this.logger.log(`Generated token: ${token.substring(0, 10)}...`);
```

## Database Security

### Use Parameterized Queries

```typescript
// ✅ GOOD: Prisma automatically parameterizes
await prisma.user.findMany({
  where: { email: userInput },
});

// ❌ NEVER: Raw SQL with string interpolation
await prisma.$queryRaw(`SELECT * FROM users WHERE email = '${userInput}'`);

// ✅ GOOD: Raw SQL with parameters
await prisma.$queryRaw`SELECT * FROM users WHERE email = ${userInput}`;
```

### Principle of Least Privilege

```sql
-- Database user should only have necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON nexusai.* TO 'app_user'@'localhost';
REVOKE DROP, CREATE, ALTER ON nexusai.* FROM 'app_user'@'localhost';
```

## Dependency Security

### Regular Audits

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Update dependencies
npm update
```

### Lock Dependencies

```bash
# Commit package-lock.json
git add package-lock.json
git commit -m "Lock dependencies"
```

## Secrets Management

### Use Environment Variables

```typescript
// ❌ BAD: Hardcoded secret
const apiKey = 'sk-1234567890abcdef';

// ✅ GOOD: From environment
const apiKey = process.env.OPENAI_API_KEY;
```

### Rotate Secrets Regularly

- JWT secrets: Every 90 days
- API keys: Every 180 days
- Database passwords: Every 90 days

## Checklist Before Production

- [ ] All secrets in environment variables
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Authentication on protected routes
- [ ] Authorization checks for resources
- [ ] Error messages don't expose internals
- [ ] Logging doesn't include sensitive data
- [ ] Dependencies audited (npm audit)
- [ ] Security headers configured (Helmet)
- [ ] File uploads validated
- [ ] SQL injection prevention verified
- [ ] XSS prevention implemented
- [ ] CSRF protection enabled
