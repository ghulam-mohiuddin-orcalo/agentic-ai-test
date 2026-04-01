---
name: seed
description: Seed database with sample data
---

# Seed Skill

Populates database with sample data for development.

## Usage

```bash
/seed [--reset]
```

## What it does

1. Optionally resets database (--reset flag)
2. Runs `prisma db seed`
3. Reports seeded records count

## Examples

```bash
/seed
/seed --reset
```

## Implementation

```typescript
// Reset if flag provided
if (reset) {
  await exec('npx prisma migrate reset --force');
}

// Run seed
await exec('npx prisma db seed');

// Report
console.log('Database seeded successfully');
```
