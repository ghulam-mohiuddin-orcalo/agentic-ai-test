---
name: lint
description: Run ESLint and Prettier on the codebase
---

# Lint Skill

Runs linting and formatting checks across the project.

## Usage

```bash
/lint              # Lint all
/lint backend      # Lint backend only
/lint frontend     # Lint frontend only
/lint --fix        # Auto-fix issues
```

## Steps

1. Determine scope (all, backend, frontend)
2. Run ESLint on target directory
3. If `--fix`: append `--fix` flag
4. Report: errors, warnings, files affected

## Commands

```bash
# Backend
cd backend && npx eslint "src/**/*.ts" --fix

# Frontend
cd frontend && npx next lint --fix
```
