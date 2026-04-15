# Claude Code — Project Context

This file is automatically read by Claude Code at the start of every session.

---

## Agent knowledge base

All non-obvious project knowledge lives in [`agent-docs/`](./agent-docs/README.md). Always read the relevant files before starting a task.

| Folder | When to read |
|--------|-------------|
| [`agent-docs/context/architecture.md`](./agent-docs/context/architecture.md) | Before any native code, iOS/Android build, or module work |
| [`agent-docs/context/known-gotchas.md`](./agent-docs/context/known-gotchas.md) | Before touching E2E, iOS build scripts, or TurboModule code |
| [`agent-docs/playbooks/e2e-test-run.md`](./agent-docs/playbooks/e2e-test-run.md) | Before running or debugging E2E tests |
| [`agent-docs/playbooks/new-module-migration.md`](./agent-docs/playbooks/new-module-migration.md) | Before migrating any package to TurboModule |
| [`agent-docs/playbooks/release-checklist.md`](./agent-docs/playbooks/release-checklist.md) | Before cutting a release |
| [`agent-docs/migrations/optimize-turbo.md`](./agent-docs/migrations/optimize-turbo.md) | Deep reference for the Optimize TurboModule migration |
| [`agent-docs/context/ios-native-log-capture.md`](./agent-docs/context/ios-native-log-capture.md) | Before debugging iOS E2E native log capture issues |
| [`agent-docs/errors/`](./agent-docs/errors/) | When hitting a build, E2E, or native error — check here first |

---

## Repo quick-reference

- **Packages:** `packages/<extension>/` — one npm package per AEP extension
- **Test app:** `apps/AwesomeProject/` — RN app used for E2E
- **E2E:** `e2e/` — WebdriverIO 9 + Appium 3
- **Committed docs:** `docs/` — development guide, migration guide, Expo guide

## Key rules (do not skip)

1. **Never delete `ios/build` after `pod install`** — codegen writes `RCTAppDependencyProvider.h` there during pod install. Deleting it breaks xcodebuild. See `agent-docs/context/known-gotchas.md`.
2. **Always source nvm before running e2e commands** — Appium is nvm-managed and must be on PATH.
3. **Clean Pods + build when switching `USE_INTEROP_ROOT`** — iOS flag is compile-time; stale artifacts silently ignore the new value.
4. **`getTurboModule:` is required on both TurboModule and interop paths** (RN 0.84+).

## Git rules for agents

- **Never commit autonomously.** Always show the diff / proposed changes and ask the user for explicit approval before running `git commit`, `git push`, or any destructive git operation.
- Only proceed with a commit when the user explicitly says so (e.g. "commit this", "yes go ahead").

## Adding new knowledge

- New error encountered → `agent-docs/errors/<area>-<description>.md` (copy `agent-docs/_TEMPLATE.md`)
- Non-obvious rule discovered → append to `agent-docs/context/known-gotchas.md`
- New recurring task → `agent-docs/playbooks/<task>.md`
