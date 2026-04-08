---
name: test-module
description: Run tests for a specific module
---

# Test Module Skill

Runs Jest tests filtered to a specific module with optional coverage and watch mode.

## Usage

```bash
/test-module auth
/test-module chat --watch
/test-module models --coverage
/test-module all
```

## Steps

1. If `all`: run `cd backend && npm test`
2. Otherwise: run `cd backend && npx jest --testPathPattern="src/modules/<name>"`
3. If `--coverage`: append `--coverage --coverageDirectory=coverage/<name>`
4. If `--watch`: append `--watch`
5. Report: tests passed/failed, coverage percentage (if requested)

## Module Name Mapping

| Input | Pattern |
|-------|---------|
| `auth` | `src/modules/auth/` |
| `chat` | `src/modules/chat/` |
| `models` | `src/modules/models/` |
| `agents` | `src/modules/agents/` |
| `users` | `src/modules/users/` |
| `usage` | `src/modules/usage/` |
| `all` | `src/` |

## Notes

- Tests must exist (`*.spec.ts` files) to pass
- If no tests found, report "No test files found for module: <name>"
