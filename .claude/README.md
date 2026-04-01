# NexusAI .claude Directory Structure

```
.claude/
├── CLAUDE.md                      # Main configuration and guidelines
├── agents/                        # Specialized agents
│   ├── api-builder.md             # Build NestJS APIs
│   ├── backend-architect.md       # Design module architecture
│   ├── database-expert.md         # Prisma schema and queries
│   ├── feature-planner.md         # Plan end-to-end backend features
│   ├── security-auditor.md        # Security review
│   └── test-writer.md             # Write comprehensive tests
├── skills/                        # Custom commands
│   ├── api-doc.md                 # Generate API documentation
│   ├── migrate.md                 # Run Prisma migrations
│   ├── seed.md                    # Seed database
│   └── test-module.md             # Test specific module
└── rules/                         # Development guidelines
    ├── agentic-workflows.md       # Standard agent + skill workflows
    ├── ai-integration.md          # AI provider integration
    ├── coding-standards.md        # TypeScript/NestJS standards
    ├── performance.md             # Optimization guidelines
    └── security.md                # Security best practices
```

## Quick Reference

### Agents
- **feature-planner**: Plan end-to-end backend features and map to agents/skills
- **backend-architect**: Design module structure and schemas
- **api-builder**: Implement controllers, services, DTOs
- **database-expert**: Optimize Prisma queries and schemas
- **security-auditor**: Review code for vulnerabilities
- **test-writer**: Write unit, integration, e2e tests

### Skills
- `/migrate <name>`: Run Prisma migration
- `/seed [--reset]`: Seed database with sample data
- `/test-module <name>`: Run tests for specific module
- `/api-doc [--serve]`: Generate API documentation

### Rules
- **agentic-workflows**: Recommended sequences of agents and skills
- **coding-standards**: Naming, TypeScript/NestJS patterns
- **security**: Auth, validation, rate limiting
- **performance**: Caching, queries, optimization
- **ai-integration**: Provider abstraction, streaming, tools

## Agentic Workflow Examples

High-level workflows are defined in `rules/agentic-workflows.md`. Common flows:

### New Backend Feature
```
Use feature-planner to design the feature
Use database-expert for Prisma schema and indexes
Run /migrate (and /seed if needed)
Use backend-architect to design module structure
Use api-builder to implement endpoints and services
Use test-writer to add tests and run /test-module
Use security-auditor to review security
Run /api-doc to refresh API docs
```

### Security Review
```
Use security-auditor agent to review code
Check rules/security.md for guidelines
Fix identified vulnerabilities
Re-run security audit and /test-module for affected modules
```

### Performance Optimization
```
Use database-expert agent to analyze queries and schema
Check rules/performance.md for patterns
Use backend-architect to adjust caching/queues where needed
Implement changes with api-builder
Run /test-module to verify and protect against regressions
Run /api-doc if API surface changed
```
