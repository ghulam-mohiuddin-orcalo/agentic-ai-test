---
name: test-module
description: Run tests for specific module
---

# Test Module Skill

Runs unit and integration tests for a specific NestJS module.

## Usage

```bash
/test-module <module-name> [--watch] [--coverage]
```

## What it does

1. Finds test files for specified module
2. Runs Jest with module filter
3. Shows coverage if requested
4. Watch mode for development

## Examples

```bash
/test-module auth
/test-module chat --watch
/test-module models --coverage
```

## Implementation

```typescript
// Build test pattern
const pattern = `src/modules/${moduleName}`;

// Run tests
await exec(`npm test -- ${pattern} ${watch ? '--watch' : ''} ${coverage ? '--coverage' : ''}`);
```
