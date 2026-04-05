---
name: jira
description: Fetch JIRA ticket, auto-classify, create branch, implement, review, and create PR
---

# JIRA Ticket-to-PR Automation

Complete automated pipeline: Ticket → Branch → Implement → Review → Push → PR

## Usage

```bash
/jira NEXUS-42
/jira PROJ-123
```

Just provide the JIRA ticket key. Everything else is automatic.

## Pipeline Steps

### Step 1: Fetch Ticket Details

Try fetching from Jira MCP server. If Jira MCP is unavailable (not connected), ask the user for these details:
- Ticket title/summary
- Description / acceptance criteria
- Ticket type (Bug, Task, Story, Epic)

Use this format to ask:
```
Jira MCP is not connected. Please provide:
1. Ticket title: (e.g., "Add user profile page")
2. Description: (what needs to be done)
3. Type: (Bug / Task / Story)
```

### Step 2: Classify Ticket

Analyze the ticket description and classify the scope:

| Keywords in Ticket | Classification | Agent |
|---|---|---|
| UI, page, component, button, form, style, CSS, frontend, layout, modal, sidebar, responsive | Frontend | `frontend-dev` |
| API, endpoint, controller, service, database, model, schema, migration, auth, guard, middleware | Backend | `api-builder` |
| Both frontend and backend mentioned, full feature, "end-to-end" | Full-stack | `feature-planner` → `api-builder` + `frontend-dev` |
| Schema, table, column, index, database optimization | Database | `database-expert` |
| Security, vulnerability, auth, XSS, injection, OWASP | Security | `security-auditor` |

### Step 3: Create Branch

```bash
# Determine branch prefix from ticket type
# Bug → bugfix/TICKET-123-short-title
# Story/Task/Feature → feature/TICKET-123-short-title

# Create from main
git checkout main
git pull origin main
git checkout -b <branch-type>/<TICKET-KEY>-<short-description>
```

Branch name rules:
- Lowercase, hyphen-separated
- Max 60 characters
- Use 3-5 word description from ticket title
- Example: `feature/NEXUS-42-user-profile-page`

### Step 4: Implement

Route to the classified agent with full ticket context:

**For Backend tickets → `api-builder` agent:**
Pass: ticket description, affected modules (from project-map.md), relevant DTOs, coding standards

**For Frontend tickets → `frontend-dev` agent:**
Pass: ticket description, affected pages/components, MUI/Tailwind standards, API endpoints needed

**For Full-stack tickets → parallel agents:**
1. `api-builder` for backend work
2. `frontend-dev` for frontend work
Ensure API contracts match between both.

**For Database tickets → `database-expert` agent:**
After schema changes, auto-run `/migrate <name>`

### Step 5: Code Review

After implementation, run review:
- Use `simplify` skill to check code quality, reuse, and efficiency
- Check against `.claude/rules/coding-standards.md`
- Check against `.claude/rules/security.md`
- Fix any issues found

### Step 6: Push & Create PR

```bash
# Stage and commit
git add <specific-files-changed>
git commit -m "<type>(<scope>): <description>

Refs: <TICKET-KEY>"

# Push
git push -u origin <branch-name>
```

Create PR using GitHub MCP with:
- **Title**: `[<TICKET-KEY>] <ticket-title>`
- **Body**:
  ```
  ## Summary
  - What was done (2-3 bullets from ticket)

  ## Ticket
  [<TICKET-KEY>] - <ticket-title> (link if Jira connected)

  ## Changes
  - List of files changed and what was modified

  ## Test Plan
  - [ ] Manual testing steps from acceptance criteria
  - [ ] `/test-module <module>` passes

  🤖 Generated with [Claude Code](https://claude.com/claude-code)
  ```
- **Base**: `main`
- **Head**: the new branch

### Step 7: Report

Print final summary:
```
✅ Pipeline Complete!

📋 Ticket: <TICKET-KEY> - <title>
🏷️  Type: <Bug/Feature/Task>
🔀 Branch: <branch-name>
🤖 Agent: <agent-used>
📝 PR: <PR-URL>

Changes:
- <file1>: <what changed>
- <file2>: <what changed>
```

## Error Handling

- **Jira not connected**: Fall back to asking user for ticket details
- **Branch already exists**: Suggest a different name or ask to checkout existing
- **Implementation fails**: Show error, suggest fixes, don't create PR
- **Review finds issues**: Fix automatically, re-review, then continue
- **Push fails**: Check if remote exists, suggest `git remote add` if missing
- **PR creation fails**: Show error, provide manual `gh pr create` command

## Important Rules

1. NEVER skip the classification step — always route to the correct agent
2. NEVER create PR without code review passing
3. ALWAYS create branch from latest `main`
4. ALWAYS reference ticket key in commit messages and PR title
5. ALWAYS run `/lint` before pushing
6. NEVER push to `main` directly — always use a feature/bugfix branch
7. If ticket is unclear, ask the user before implementing
