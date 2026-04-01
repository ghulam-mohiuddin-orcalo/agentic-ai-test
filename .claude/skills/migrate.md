---
name: migrate
description: Run Prisma migrations and generate client
---

# Migrate Skill

Handles Prisma database migrations and client generation.

## Usage

```bash
/migrate [name]
```

## What it does

1. Checks if Prisma schema exists
2. Runs `prisma migrate dev --name <name>`
3. Generates Prisma client
4. Validates migration success

## Examples

```bash
/migrate add-user-preferences
/migrate create-agents-table
```

## Implementation

```typescript
// Check schema
const schemaExists = await fileExists('prisma/schema.prisma');

// Run migration
await exec(`npx prisma migrate dev --name ${name}`);

// Generate client
await exec('npx prisma generate');

// Verify
await exec('npx prisma validate');
```
