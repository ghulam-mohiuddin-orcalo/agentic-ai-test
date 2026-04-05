---
name: seed
description: Seed database with sample data for development
---

# Seed Skill

Populates the database with sample models, users, and conversations for development.

## Usage

```bash
/seed          # Run seed
/seed --reset  # Reset database first, then seed
```

## Steps

1. Check if `backend/prisma/seed.ts` exists
   - If not: create it with sample data (models, admin user, test conversations)
2. If `--reset`: run `cd backend && npx prisma migrate reset --force`
3. Run `cd backend && npx prisma db seed`
4. Report: records created per table

## Sample Seed Data

When creating seed.ts, include:
- 1 admin user (admin@nexusai.com)
- 5+ AI models across providers (OpenAI, Anthropic, Google)
- 3+ sample conversations with messages
- 2+ agent templates
- Usage data for the last 7 days

## Prisma Seed Config

Ensure `backend/package.json` has:
```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```
