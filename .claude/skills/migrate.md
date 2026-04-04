---
name: migrate
description: Run Prisma migrations and generate client
---

# Migrate Skill

Applies Prisma schema changes to the database and regenerates the client.

## Usage

```bash
/migrate add-user-preferences
/migrate create-notifications-table
```

## Steps

1. Verify `backend/prisma/schema.prisma` exists and is valid
2. Run `cd backend && npx prisma validate`
3. Run `cd backend && npx prisma migrate dev --name <name>`
4. Run `cd backend && npx prisma generate`
5. Report: migration file created, client generated

## Error Handling

- If validate fails: show the schema error and stop
- If migrate fails: show the SQL error, suggest fixes
- If generate fails: show the error, may need `npm install`

## Notes

- Always run from project root
- The `backend/` prefix is required for all Prisma commands
- Migration name should be descriptive (e.g., `add-user-preferences`, not `update`)
