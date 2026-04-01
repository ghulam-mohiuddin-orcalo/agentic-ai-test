---
name: agentic-workflows
description: Standard agent + skill workflows for NexusAI backend
---

# Agentic Workflows

This file defines standard, repeatable workflows that combine agents and skills to work on the NexusAI backend efficiently.

## Overview of Available Agents

- **feature-planner**: High-level feature planning and breakdown
- **backend-architect**: Design NestJS module architecture and Prisma schemas
- **api-builder**: Implement controllers, services, DTOs, and tests
- **database-expert**: Design/optimize Prisma schema and queries
- **security-auditor**: Security review and hardening
- **test-writer**: Unit, integration, and e2e test authoring

## Overview of Available Skills

- `/migrate [name]`: Run Prisma migrations and generate client
- `/seed [--reset]`: Seed database with sample data
- `/test-module <name> [--watch] [--coverage]`: Run tests for a module
- `/api-doc [--serve]`: Generate/serve API documentation

## Workflow 1 – New Backend Feature (Happy Path)

Use this when adding a new capability to the backend (e.g. “usage-based billing”, “model tags”, “agent templates”).

1. **Plan**
   - Agent: **feature-planner**
   - Goal: Turn the product idea into a concrete plan.
   - Inputs:
     - Short feature description
     - Affected user roles
     - Constraints (latency, security, cost, scale)
   - Output:
     - Checklist of subtasks, mapping each to agents and skills below.

2. **Schema & Data Design**
   - Agent: **database-expert**
   - Use `rules/performance.md` and `rules/security.md` as references.
   - Tasks:
     - Propose Prisma model changes and indexes
     - Identify relations and soft-delete needs
   - Then:
     - Run `/migrate <meaningful-name>`
     - Optionally run `/seed [--reset]` to prepare dev data.

3. **Module & API Design**
   - Agent: **backend-architect**
   - Tasks:
     - Decide which module(s) to extend or create
     - Design controllers, services, DTOs, guards, interceptors as needed
     - Specify endpoints, DTO fields, and auth requirements

4. **Implementation**
   - Agent: **api-builder**
   - Tasks:
     - Implement or update controllers and services
     - Wire Prisma access, caching, queues, and AI provider calls
     - Keep controllers thin; move business logic into services.

5. **Testing**
   - Agent: **test-writer**
   - Tasks:
     - Add unit tests for services and key utilities
     - Add integration/e2e tests for critical flows
   - Run:
     - `/test-module <module-name> [--coverage]`

6. **Security Review**
   - Agent: **security-auditor**
   - Use:
     - `rules/security.md`
     - `CLAUDE.md` security sections
   - Tasks:
     - Verify auth/guards, validation, rate limiting, logging, and secrets

7. **Docs & Finalization**
   - Run:
     - `/api-doc [--serve]` to update and/or preview API documentation.
   - Ensure relevant parts of `CLAUDE.md` or project docs reflect the changes.

## Workflow 2 – Schema-Only Change

Use when the main work is changing data structures (e.g. adding columns, indexes).

1. **database-expert**
   - Propose Prisma schema changes and migration plan.
2. `/migrate <name>`
3. `/seed [--reset]` if data reset is acceptable.
4. **test-writer**
   - Adjust tests impacted by schema changes.
5. `/test-module <affected-module> --coverage`

## Workflow 3 – Security Hardening Pass

Use before production, after major auth changes, or when reviewing attack surface.

1. **security-auditor**
   - Review modules, DTOs, guards using:
     - `rules/security.md`
     - `CLAUDE.md` security notes
2. **database-expert**
   - Validate query patterns, raw SQL usage, and least-privilege DB access.
3. **test-writer**
   - Add tests for auth, rate limiting, and validation failure paths.
4. `/test-module auth --coverage`

## Workflow 4 – Performance Optimization

Use when there are latency, throughput, or cost issues.

1. **database-expert**
   - Analyze hotspots and propose schema/index/query changes.
2. **backend-architect**
   - Adjust module boundaries, caching layers, or use queues/background jobs.
3. Implement optimizations with **api-builder**.
4. **test-writer**
   - Add regression tests around optimized endpoints.
5. `/test-module <module-name>`

## How to Use This File

- Start with **feature-planner** for any non-trivial change.
- For each checklist item, explicitly choose the corresponding agent and run it with the relevant rules file(s) attached.
- Trigger the skills (`/migrate`, `/seed`, `/test-module`, `/api-doc`) at the points indicated above.
- Keep this file updated as the project adds new agents or skills.

