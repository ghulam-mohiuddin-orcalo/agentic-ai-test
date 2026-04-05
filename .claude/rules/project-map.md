---
name: project-map
description: Complete map of modules, endpoints, components, and their current status
---

# Project Map

Quick reference for all modules, endpoints, and components. Use this instead of reading source files.

## Backend API Endpoints

### Auth (`/api/v1/auth`)
| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| POST | /auth/register | No | Create account, return tokens |
| POST | /auth/login | No | Validate credentials, return tokens |
| POST | /auth/refresh | No | Refresh access token |
| GET | /auth/profile | JWT | Get current user profile |

### Chat (`/api/v1/chat`)
| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| POST | /chat/conversations | JWT | Create conversation |
| GET | /chat/conversations | JWT | List conversations (paginated) |
| GET | /chat/conversations/:id | JWT | Get conversation + messages |
| DELETE | /chat/conversations/:id | JWT | Delete (owner only) |
| POST | /chat/conversations/:id/messages | JWT | Add message |
| GET | /chat/conversations/:id/messages | JWT | List messages (paginated) |
| WS | /chat | JWT | Real-time streaming (simulated) |

### Models (`/api/v1/models`)
| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| GET | /models | No | List models (filter, sort, paginate) |
| GET | /models/providers | No | Distinct providers |
| GET | /models/tags | No | Unique tags |
| GET | /models/:id | No | Model + reviews + counts |
| POST | /models | JWT | Create model |
| PUT | /models/:id | JWT | Update model |
| DELETE | /models/:id | JWT | Delete model |
| POST | /models/:id/reviews | JWT | Add review (1 per user) |
| GET | /models/:id/reviews | No | List reviews (paginated) |

### Agents (`/api/v1/agents`)
| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| POST | /agents | JWT | Create agent |
| GET | /agents | JWT | List user's agents |
| GET | /agents/:id | JWT | Get agent (owner only) |
| PUT | /agents/:id | JWT | Update agent (owner only) |
| DELETE | /agents/:id | JWT | Delete agent (owner only) |
| POST | /agents/:id/deploy | JWT | Deploy to endpoint |
| POST | /agents/:id/undeploy | JWT | Undeploy |
| POST | /agents/:id/test | JWT | Test agent (simulated) |
| GET | /agents/templates | JWT | List templates (hardcoded) |

### Users (`/api/v1/users`)
| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| GET | /users/me | JWT | Get profile |
| PUT | /users/me | JWT | Update profile |
| DELETE | /users/me | JWT | Delete account |
| PUT | /users/me/password | JWT | Change password |
| POST | /users/me/api-keys | JWT | Create API key |
| GET | /users/me/api-keys | JWT | List API keys |
| DELETE | /users/me/api-keys/:keyId | JWT | Delete API key |

### Usage (`/api/v1/usage`)
| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| POST | /usage/track | JWT | Record usage |
| GET | /usage/stats | JWT | Aggregate stats |
| GET | /usage/by-model | JWT | Stats grouped by model |
| GET | /usage/history | JWT | Paginated log |

## Frontend Pages

| Route | Page | Status |
|-------|------|--------|
| `/` | Home (landing) | Implemented |
| `/login` | Login form | Implemented |
| `/register` | Registration form | Implemented |
| `/chat` | Chat interface + streaming | Implemented (simulated AI) |
| `/agents` | Agent builder | Implemented |
| `/marketplace` | Model marketplace | Implemented (hardcoded data) |
| `/discover` | AI research feed | Implemented (hardcoded data) |
| `/profile` | User profile | **Missing** |
| `/settings` | User settings | **Missing** |
| `/forgot-password` | Password reset | **Missing** |

## Frontend Components

| Directory | Components |
|-----------|-----------|
| `components/chat/` | ChatInput, MessageThread, ModelsSidebar, QuickActionsPanel, WelcomeScreen |
| `components/agents/` | NewAgentModal |
| `components/auth/` | AuthHydration |
| `components/hero/` | ActionGrid, HeroSearchCard, OnboardingFlow, QuestionStep, StatsBar |
| `components/landing/` | BrowseByLab, BudgetTiers, BuiltForBuilders, FeaturedModels, FlagshipComparison, TrendingModels, UseCases, NewsletterCTA |
| `components/layout/` | Navbar, Footer |
| `components/marketplace/` | MarketplaceFilterSidebar, MarketplaceModelCard |
| `components/models/` | ModelCard |

## Redux Store

| Slice/API | Purpose |
|-----------|---------|
| `authSlice` | Token, user, login state + localStorage |
| `chatSlice` | Streaming state (start, chunks, finish) |
| `uiSlice` | Sidebar, panels, modals, language, theme |
| `onboardingSlice` | 9-step guided discovery |
| `authApi` | Register, login, refresh, getProfile |
| `chatApi` | Conversations, messages CRUD |

## Implementation Status

### Fully Working
- Auth flow (register, login, JWT, refresh)
- User profile CRUD, password change, API keys
- Model catalog CRUD, filtering, reviews
- Agent CRUD, deploy/undeploy
- Conversation + message CRUD
- Usage tracking + stats
- Docker Compose setup

### Simulated / Needs Real Implementation
- AI chat responses (ChatGateway - word-splitting simulation)
- Agent test responses (AgentsService - static string)
- No real OpenAI/Anthropic/Google API calls

### Missing Infrastructure
- Health endpoint (`/api/v1/health`)
- Database seed file (`prisma/seed.ts`)
- Prisma migrations folder
- Redis caching (declared but unused)
- S3 storage (declared but unused)
- Test files (zero tests exist)
