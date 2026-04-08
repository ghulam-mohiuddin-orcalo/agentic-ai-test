# NexusAI

> **AI Model Marketplace & Chat Platform** - A comprehensive platform for discovering, comparing, and interacting with multiple AI models from leading providers.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.4-E0234E?logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Quick Start (Docker)](#quick-start-docker)
  - [Local Development](#local-development)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

NexusAI is a modern, full-stack platform that enables users to:
- Browse and compare 525+ AI models from top providers (OpenAI, Anthropic, Google, etc.)
- Chat with multiple AI models in a unified interface
- Build and deploy custom AI agents with tools and capabilities
- Manage conversations with persistent storage for authenticated users
- Access real-time streaming responses via WebSocket

## Features

### Authentication & Authorization
- **User Registration** with email validation and password requirements
- **JWT-based Authentication** with access and refresh tokens
- **Guest Mode** for unauthenticated users with session storage
- **Protected Routes** with automatic token refresh
- **User Profile Management** with avatar and settings

### Chat System
- **Multi-Model Support** - Switch between GPT-4, Claude, Gemini, and more
- **Real-time Streaming** - WebSocket-based streaming responses
- **Conversation Management** - Create, view, and delete conversations
- **Dual Storage Mode**:
  - **Authenticated**: PostgreSQL database with full persistence
  - **Guest**: SessionStorage with temporary persistence
- **Message History** - Full conversation context and replay

### Agent Builder
- **Visual Agent Creator** - 4-step wizard for building custom agents
- **Model Selection** - Choose from multiple AI providers
- **Tool Configuration** - Enable web search, code execution, file operations, API calls
- **Custom System Prompts** - Define agent behavior and personality
- **Parameter Tuning** - Adjust temperature, max tokens, top-p
- **Agent Templates** - Pre-built agents for common use cases

### User Interface
- **Modern Design** - Clean, professional UI with Material-UI components
- **Responsive Layout** - Mobile-first design that works on all devices
- **Internationalization** - Multi-language support (EN, ES, FR, DE, ZH)

### Marketplace
- **Model Discovery** - Browse 525+ AI models with detailed information
- **Advanced Filtering** - Filter by provider, price, rating, license, tags
- **Model Comparison** - Side-by-side comparison of capabilities
- **User Reviews** - Community ratings and feedback
- **Usage Analytics** - Track token usage, costs, and performance

## Tech Stack

### Frontend
- **Framework**: [Next.js 16.2](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5.9](https://www.typescriptlang.org/)
- **UI Library**: [Material-UI 6.5](https://mui.com/)
- **State Management**: [Redux Toolkit 2.11](https://redux-toolkit.js.org/) + RTK Query
- **Forms**: [React Hook Form 7.72](https://react-hook-form.com/) + [Zod 3.25](https://zod.dev/)
- **Real-time**: [Socket.IO Client 4.8](https://socket.io/)
- **Styling**: CSS Variables + Emotion

### Backend
- **Framework**: [NestJS 10.4](https://nestjs.com/)
- **Language**: [TypeScript 5.9](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL 16](https://www.postgresql.org/) + [Prisma ORM 5.0](https://www.prisma.io/)
- **Authentication**: [JWT](https://jwt.io/) + [Passport](http://www.passportjs.org/)
- **Real-time**: [Socket.IO 4.6](https://socket.io/)
- **API Docs**: [Swagger/OpenAPI 7.4](https://swagger.io/)
- **Security**: [Helmet](https://helmetjs.github.io/), Rate Limiting, CORS
- **Validation**: [class-validator](https://github.com/typestack/class-validator)

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Database**: PostgreSQL 16 (Alpine)
- **Cache**: Redis 7 (Alpine)
- **Storage**: AWS S3 (Coming Soon)
- **Vector DB**: Pinecone (Coming Soon)

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Next.js    │  │    Redux     │  │  Socket.IO   │      │
│  │  App Router  │  │   Toolkit    │  │    Client    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         Backend                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   NestJS     │  │   Prisma     │  │  Socket.IO   │      │
│  │  REST API    │  │     ORM      │  │   Gateway    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       PostgreSQL                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Users     │  │Conversations │  │   Messages   │      │
│  │    Agents    │  │    Models    │  │   Reviews    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Getting Started

### Quick Start (Docker)

The fastest way to get NexusAI running. One command starts everything.

#### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)
- [Node.js](https://nodejs.org/) 22.x (for building before Docker)

#### 1. Clone and configure

```bash
git clone https://github.com/yourusername/nexusai.git
cd nexusai

# Copy environment files
cp .env.example .env
```

Edit `.env` and fill in your secrets (JWT secrets, AI provider API keys, etc.).

#### 2. Install dependencies and build

```bash
# Install all dependencies (root + backend + frontend)
npm run install:all

# Build backend
cd backend
npx prisma generate
npm run build
cd ..

# Build frontend
cd frontend
npm run build
cd ..
```

#### 3. Start all services

```bash
docker compose up -d
```

That's it. All four services start together:

| Service | Container | Port | URL |
|---------|-----------|------|-----|
| Frontend | `nexusai-frontend` | 3000 | http://localhost:3000 |
| Backend | `nexusai-backend` | 5001 | http://localhost:5001 |
| PostgreSQL | `nexusai-postgres` | 5432 | localhost:5432 |
| Redis | `nexusai-redis` | 6379 | localhost:6379 |

#### Useful Docker commands

```bash
# Start (detached)
docker compose up -d

# Start with rebuild
docker compose up --build -d

# Stop all services
docker compose down

# Stop and remove database volumes (resets all data)
docker compose down -v

# View logs
docker compose logs -f

# View logs for a specific service
docker compose logs -f backend

# Restart a single service
docker compose restart backend

# Check status
docker compose ps
```

### Local Development

For active development with hot-reload on both frontend and backend.

#### Prerequisites

- **Node.js** 22.x or higher
- **npm** 10.x or higher
- **Docker** (for PostgreSQL and Redis)
- **Git**

#### 1. Start infrastructure services

```bash
# Start only PostgreSQL and Redis
docker compose up postgres redis -d
```

#### 2. Configure environment

```bash
# Backend config
cp .env.example backend/.env
# Edit backend/.env with your configuration

# Frontend config  
cp .env.example frontend/.env.local
# Edit frontend/.env.local with your configuration
```

#### 3. Run both services with one command

```bash
# From project root - runs backend + frontend concurrently
npm run dev
```

Or run individually:

```bash
# Backend (port 5001)
cd backend
npm install
npx prisma generate
npm run start:dev

# Frontend (port 3000) - in a separate terminal
cd frontend
npm install
npm run dev
```

#### Environment Variables

**Backend** (`backend/.env`)
```env
# Database
DATABASE_URL=postgresql://nexusai:nexusai_pass@localhost:5432/nexusai
REDIS_URL=redis://localhost:6379

# Server
PORT=5001

# JWT
JWT_SECRET=your-256-bit-secret-key-here
JWT_REFRESH_SECRET=your-256-bit-refresh-secret-key-here

# CORS
ALLOWED_ORIGINS=http://localhost:3000

# AI Providers (Optional)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=...
```

**Frontend** (`frontend/.env.local`)
```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:5001

# App
NEXT_PUBLIC_APP_NAME=NexusAI
```

**Root** (`.env` - used by Docker Compose)
```env
# PostgreSQL
POSTGRES_USER=nexusai
POSTGRES_PASSWORD=nexusai_pass
POSTGRES_DB=nexusai

# JWT Secrets
JWT_SECRET=your-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars

# CORS
ALLOWED_ORIGINS=http://localhost:3000

# AI Provider keys
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
```

## Project Structure

```
nexusai/
├── docker-compose.yml          # Full stack Docker Compose
├── package.json                # Root package (concurrently, scripts)
├── .env.example                # Environment template
│
├── backend/                    # NestJS backend
│   ├── Dockerfile              # Backend Docker image
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # Authentication & JWT
│   │   │   ├── chat/          # Chat & conversations
│   │   │   ├── models/        # AI model catalog
│   │   │   ├── agents/        # Agent builder
│   │   │   ├── users/         # User management
│   │   │   └── usage/         # Analytics & tracking
│   │   ├── common/            # Shared utilities
│   │   ├── config/            # Configuration
│   │   ├── prisma/            # Prisma service
│   │   └── main.ts            # Entry point
│   └── package.json
│
├── frontend/                   # Next.js frontend
│   ├── Dockerfile              # Frontend Docker image
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   │   ├── (auth)/        # Auth pages
│   │   │   ├── chat/          # Chat interface
│   │   │   ├── agents/        # Agent builder
│   │   │   └── marketplace/   # Model marketplace
│   │   ├── components/        # React components
│   │   ├── store/             # Redux store
│   │   │   ├── api/           # RTK Query APIs
│   │   │   └── slices/        # Redux slices
│   │   ├── lib/               # Utilities
│   │   └── hooks/             # Custom hooks
│   └── package.json
│
└── README.md
```

## API Documentation

### REST API Endpoints

#### Authentication
```
POST   /api/v1/auth/register     - Register new user
POST   /api/v1/auth/login        - Login user
POST   /api/v1/auth/refresh      - Refresh access token
GET    /api/v1/auth/profile      - Get current user profile
```

#### Chat
```
POST   /api/v1/chat/conversations              - Create conversation
GET    /api/v1/chat/conversations              - List conversations
GET    /api/v1/chat/conversations/:id          - Get conversation
DELETE /api/v1/chat/conversations/:id          - Delete conversation
POST   /api/v1/chat/conversations/:id/messages - Add message
GET    /api/v1/chat/conversations/:id/messages - Get messages
```

#### Models
```
GET    /api/v1/models           - List all models
GET    /api/v1/models/:id       - Get model details
GET    /api/v1/models/providers - List providers
GET    /api/v1/models/tags      - List tags
POST   /api/v1/models/:id/reviews - Add review
```

#### Agents
```
POST   /api/v1/agents           - Create agent
GET    /api/v1/agents           - List agents
GET    /api/v1/agents/:id       - Get agent
PUT    /api/v1/agents/:id       - Update agent
DELETE /api/v1/agents/:id       - Delete agent
POST   /api/v1/agents/:id/deploy - Deploy agent
POST   /api/v1/agents/:id/test  - Test agent
```

### WebSocket Events

#### Chat Streaming
```javascript
// Client → Server
socket.emit('chat', {
  conversationId: string,
  modelId: string,
  messages: Message[]
})

// Server → Client
socket.on('chat:chunk', (data: { delta: string }) => {})
socket.on('chat:done', (data: { success: boolean }) => {})
socket.on('chat:error', (data: { message: string }) => {})
```

### Interactive API Documentation

Visit `http://localhost:5001/api/docs` for interactive Swagger documentation.

## Development

### Root-Level Scripts

```bash
# Run frontend + backend concurrently (hot-reload)
npm run dev

# Build both
npm run build

# Install all dependencies
npm run install:all

# Docker Compose shortcuts
npm run docker:up          # Start all services
npm run docker:up:build    # Start with rebuild
npm run docker:down        # Stop all services
npm run docker:down:volumes # Stop and wipe volumes
```

### Running Tests

**Backend**
```bash
cd backend
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run test:cov      # Test coverage
```

**Frontend**
```bash
cd frontend
npm run test
```

### Database Management

```bash
cd backend

# Create migration
npx prisma migrate dev --name description

# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio

# Generate Prisma client
npx prisma generate
```

### Code Quality

```bash
# Lint
npm run lint

# Format
npm run format
```

### Development Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "feat: add feature"`
3. Push to remote: `git push origin feature/your-feature`
4. Create Pull Request
5. Wait for review and CI checks
6. Merge to main

## Deployment

### Full Stack with Docker Compose

```bash
# Clone and configure
git clone https://github.com/yourusername/nexusai.git
cd nexusai
cp .env.example .env
# Edit .env with production values

# Install, build, and start
npm run install:all
cd backend && npx prisma generate && npm run build && cd ..
cd frontend && npm run build && cd ..
docker compose up -d
```

### Individual Service Deployment

**Backend (Docker)**
```bash
cd backend
docker build -t nexusai-backend .
docker run -p 5001:5001 \
  -e DATABASE_URL=postgresql://... \
  -e REDIS_URL=redis://... \
  -e JWT_SECRET=... \
  nexusai-backend
```

**Frontend (Vercel)**
```bash
vercel deploy
```

**Frontend (Docker)**
```bash
cd frontend
docker build -t nexusai-frontend .
docker run -p 3000:3000 nexusai-frontend
```

### Deployment Checklist

- [ ] Environment variables configured in `.env`
- [ ] Database migrations applied
- [ ] Redis connection tested
- [ ] SSL certificates installed
- [ ] CORS origins whitelisted
- [ ] Rate limiting configured
- [ ] Logging and monitoring enabled
- [ ] Health check endpoints working
- [ ] API keys for AI providers added

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [NestJS](https://nestjs.com/) - Node.js framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Material-UI](https://mui.com/) - React UI library
- [Socket.IO](https://socket.io/) - Real-time communication
- [Docker](https://www.docker.com/) - Containerization

## Support

- **Documentation**: [Coming Soon]
- **Issues**: [GitHub Issues](https://github.com/yourusername/nexusai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/nexusai/discussions)

## Roadmap

- [x] User authentication and authorization
- [x] Multi-model chat interface
- [x] Agent builder with visual editor
- [x] Real-time streaming responses
- [x] Docker Compose for full-stack deployment
- [x] Single-command development setup
- [ ] Redis caching layer
- [ ] AWS S3 file storage
- [ ] Pinecone vector database
- [ ] Background job processing
- [ ] Usage analytics dashboard
- [ ] Dark mode support
- [ ] Mobile app (React Native)
- [ ] API rate limiting per user
- [ ] Webhook support
- [ ] Team collaboration features

---

**Built by the NexusAI Team**

*Last Updated: April 2026*
