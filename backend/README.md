# NexusAI Backend

AI Model Marketplace and Chat Platform API built with NestJS.

## Tech Stack

- **Framework**: NestJS 10 + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Cache**: Redis
- **Auth**: JWT + Passport
- **Real-time**: Socket.IO
- **Queue**: Bull
- **Storage**: AWS S3
- **Vector DB**: Pinecone

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Setup Database
```bash
# Start PostgreSQL (Docker example)
docker run --name nexusai-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=nexusai -p 5432:5432 -d postgres

# Run migrations
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate
```

### 4. Start Development Server
```bash
npm run start:dev
```

Server runs on `http://localhost:3001`

## Available Scripts

- `npm run start:dev` - Start development server with watch mode
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run test` - Run tests
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:migrate` - Run database migrations

## Project Structure

```
src/
├── modules/
│   ├── auth/          # Authentication & authorization
│   ├── users/         # User management
│   ├── models/        # AI model catalog
│   ├── chat/          # Chat & conversations
│   ├── agents/        # Agent builder
│   ├── usage/         # Usage tracking
│   └── search/        # Search & filters
├── common/            # Shared utilities
├── config/            # Configuration
└── main.ts           # Application entry
```

## Next Steps

**Phase 1 - Week 1**: Auth & Users Module
- Implement JWT authentication
- User registration/login
- API key generation
- Role-based guards

See `.claude/CLAUDE.md` for detailed development guidelines.
