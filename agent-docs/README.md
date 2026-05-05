# `agent-docs` — developer & agent knowledge base

This directory is the source of truth for non-obvious project knowledge: error investigations, migration playbooks, recurring task guides, and architectural context. It is designed to be consumed by both **humans** and **AI agents** (Claude Code, Cursor, Copilot, etc.).

All content here is committed and version-controlled.

---

## Layout

| Path | Purpose |
|------|---------|
| `README.md` | This overview |
| `_TEMPLATE.md` | Copy to start a new error doc |
| `errors/*.md` | One file per error type — symptom, cause, fix, investigation log |
| `migrations/*.md` | Step-by-step guides for large structural changes |
| `playbooks/*.md` | Recurring task guides (E2E runs, releases, adding a new module) |
| `context/*.md` | Architecture overview and non-obvious gotchas — read this first |

---

## How to use

### For AI agents
The `context/` folder is the highest-signal starting point:
- `context/architecture.md` — repo structure, native module patterns, iOS/Android build specifics
- `context/known-gotchas.md` — non-obvious rules that have caused real bugs

Before working on native code, E2E tests, or a module migration, read those two files first.

### For humans
- Starting a new task? Check `playbooks/` first.
- Hit an error? Search `errors/` — it may already be documented.
- Working on a migration? See `migrations/`.

---

## Rules for adding new docs

### 1. One file per error type (`errors/`)
- New class of problem → new file under `errors/`
- Do not append unrelated issues to an existing file
- Copy `_TEMPLATE.md` to start

### 2. File naming
Kebab-case slugs, sortable and grep-friendly:

```
errors/<area>-<short-description>.md
```

Examples:
- `errors/e2e-ios-build-rctappdependencyprovider-not-found.md`
- `errors/android-settings-gradle-node-version-hardcoded.md`

### 3. Update the same doc until fixed
- Add to **Investigation log** as you learn more
- When resolved: set **Status: Fixed**, note the commit/PR

### 4. Promote patterns to `context/known-gotchas.md`
If a fix reveals a non-obvious rule that could affect future work, add a numbered entry to `context/known-gotchas.md` so agents and contributors benefit from it automatically.

---

## Optional: AwesomeProject

Older notes may live under `awesome-project/`; prefer `errors/` for new work so everything follows the same naming rules.
