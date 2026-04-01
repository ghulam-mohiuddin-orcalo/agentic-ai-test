# NexusAI

> **AI Model Marketplace & Chat Platform** - A comprehensive platform for discovering, comparing, and interacting with multiple AI models from leading providers.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.4-E0234E?logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

NexusAI is a modern, full-stack platform that enables users to:
- Browse and compare 525+ AI models from top providers (OpenAI, Anthropic, Google, etc.)
- Chat with multiple AI models in a unified interface
- Build and deploy custom AI agents with tools and capabilities
- Manage conversations with persistent storage for authenticated users
- Access real-time streaming responses via WebSocket

**Live Demo**: [Coming Soon]

## ✨ Features

### 🔐 Authentication & Authorization
- **User Registration** with email validation and password requirements
- **JWT-based Authentication** with access and refresh tokens
- **Guest Mode** for unauthenticated users with session storage
- **Protected Routes** with automatic token refresh
- **User Profile Management** with avatar and settings

### 💬 Chat System
- **Multi-Model Support** - Switch between GPT-4, Claude, Gemini, and more
- **Real-time Streaming** - WebSocket-based streaming responses
- **Conversation Management** - Create, view, and delete conversations
- **Dual Storage Mode**:
  - **Authenticated**: PostgreSQL database with full persistence
  - **Guest**: SessionStorage with temporary persistence
- **Message History** - Full conversation context and replay

### 🤖 Agent Builder
- **Visual Agent Creator** - 4-step wizard for building custom agents
- **Model Selection** - Choose from multiple AI providers
- **Tool Configuration** - Enable web search, code execution, file operations, API calls
- **Custom System Prompts** - Define agent behavior and personality
- **Parameter Tuning** - Adjust temperature, max tokens, top-p
- **Agent Templates** - Pre-built agents for common use cases

### 🎨 User Interface
- **Modern Design** - Clean, professional UI with Material-UI components
- **Responsive Layout** - Mobile-first design that works on all devices
- **Dark/Light Mode** - [Coming Soon]
- **Internationalization** - Multi-language support (EN, ES, FR, DE, ZH)
- **Accessibility** - WCAG 2.1 compliant

### 📊 Marketplace
- **Model Discovery** - Browse 525+ AI models with detailed information
- **Advanced Filtering** - Filter by provider, price, rating, license, tags
- **Model Comparison** - Side-by-side comparison of capabilities
- **User Reviews** - Community ratings and feedback
- **Usage Analytics** - Track token usage, costs, and performance

## 🛠 Tech Stack

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
- **Database**: PostgreSQL 16 (Docker)
- **Cache**: Redis 7 (Coming Soon)
- **Storage**: AWS S3 (Coming Soon)
- **Vector DB**: Pinecone (Coming Soon)
- **Queue**: Bull + Redis (Coming Soon)

## 🏗 Architecture

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

### Key Design Patterns
- **Modular Architecture** - Feature-based modules for scalability
- **Repository Pattern** - Data access abstraction with Prisma
- **Dependency Injection** - NestJS DI container for loose coupling
- **API Gateway Pattern** - Unified entry point for all services
- **Event-Driven** - WebSocket for real-time communication
- **Optimistic Updates** - Instant UI feedback with background sync

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **npm** 10.x or higher
- **Docker** (for PostgreSQL)
- **Git**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/nexusai.git
cd nexusai
```

2. **Start PostgreSQL database**
```bash
docker run --name nexusai-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=nexusai \
  -p 5432:5432 \
  -d postgres:16-alpine
```

3. **Setup Backend**
```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Seed database (optional)
npm run prisma:seed

# Start development server
npm run start:dev
```

Backend will run on `http://localhost:5001`

4. **Setup Frontend**
```bash
cd ../frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nexusai

# JWT
JWT_SECRET=your-256-bit-secret-key-here
JWT_REFRESH_SECRET=your-256-bit-refresh-secret-key-here
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Server
PORT=5001
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:3000

# AI Providers (Optional)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=...
```

#### Frontend (.env.local)
```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:5001

# App
NEXT_PUBLIC_APP_NAME=NexusAI

# Mock Data (for development without backend)
NEXT_PUBLIC_USE_MOCK_DATA=false
```

## 📁 Project Structure

```
nexusai/
├── backend/                    # NestJS backend
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
│   │   ├── prisma/            # Database schema
│   │   └── main.ts            # Entry point
│   ├── test/                  # Tests
│   └── package.json
│
├── frontend/                   # Next.js frontend
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   │   ├── (auth)/        # Auth pages
│   │   │   ├── chat/          # Chat interface
│   │   │   ├── agents/        # Agent builder
│   │   │   └── marketplace/   # Model marketplace
│   │   ├── components/        # React components
│   │   │   ├── auth/          # Auth components
│   │   │   ├── chat/          # Chat components
│   │   │   ├── agents/        # Agent components
│   │   │   └── layout/        # Layout components
│   │   ├── store/             # Redux store
│   │   │   ├── api/           # RTK Query APIs
│   │   │   └── slices/        # Redux slices
│   │   ├── lib/               # Utilities
│   │   └── hooks/             # Custom hooks
│   └── package.json
│
└── README.md
```

## 📚 API Documentation

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

## 🔧 Development

### Running Tests

**Backend**
```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

**Frontend**
```bash
cd frontend

# Run tests (Coming Soon)
npm run test
```

### Database Management

```bash
# Create migration
npx prisma migrate dev --name description

# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
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

## 🚢 Deployment

### Backend Deployment

**Docker**
```bash
cd backend

# Build image
docker build -t nexusai-backend .

# Run container
docker run -p 5001:5001 \
  -e DATABASE_URL=postgresql://... \
  -e JWT_SECRET=... \
  nexusai-backend
```

**Production Build**
```bash
npm run build
npm run start:prod
```

### Frontend Deployment

**Vercel** (Recommended)
```bash
vercel deploy
```

**Docker**
```bash
cd frontend

# Build image
docker build -t nexusai-frontend .

# Run container
docker run -p 3000:3000 nexusai-frontend
```

### Environment Checklist

- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] CORS origins whitelisted
- [ ] Rate limiting configured
- [ ] Logging and monitoring enabled
- [ ] Health check endpoints working
- [ ] API keys for AI providers added

## 🤝 Contributing

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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [NestJS](https://nestjs.com/) - Node.js framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Material-UI](https://mui.com/) - React UI library
- [Socket.IO](https://socket.io/) - Real-time communication

## 📞 Support

- **Documentation**: [Coming Soon]
- **Issues**: [GitHub Issues](https://github.com/yourusername/nexusai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/nexusai/discussions)
- **Email**: support@nexusai.com

## 🗺 Roadmap

- [x] User authentication and authorization
- [x] Multi-model chat interface
- [x] Agent builder with visual editor
- [x] Real-time streaming responses
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

**Built with ❤️ by the NexusAI Team**

*Last Updated: April 2026*
