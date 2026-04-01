---
name: api-doc
description: Generate API documentation from controllers
---

# API Doc Skill

Generates OpenAPI/Swagger documentation from NestJS decorators.

## Usage

```bash
/api-doc [--serve]
```

## What it does

1. Scans controllers for Swagger decorators
2. Generates OpenAPI spec
3. Optionally serves Swagger UI
4. Exports to `docs/api.json`

## Examples

```bash
/api-doc
/api-doc --serve
```

## Implementation

```typescript
// Generate spec
await exec('npm run build');
await exec('npm run swagger:generate');

// Serve if requested
if (serve) {
  console.log('Swagger UI available at http://localhost:3000/api/docs');
}
```
