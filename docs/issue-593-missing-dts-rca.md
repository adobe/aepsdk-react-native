# Issue #593 — Missing `.d.ts` Type Declarations

GitHub issue: https://github.com/adobe/aepsdk-react-native/issues/593
Branch: `fix/issue-593-restore-dts-declarations`

## Summary

Starting with certain package releases after **2026-04-09**, several
`@adobe/react-native-*` packages published to npm shipped **without**
TypeScript declaration (`.d.ts`) files, even though each package's
`package.json` still declares `"types": "./dist/index.d.ts"`. The
build itself never failed — `tsc` exited `0` either way — so nothing
caught it until a customer manually inspected `npm pack` output and
filed #593.

## Root cause

Root `tsconfig.json` lost `"declaration": true` in commit
[`52e74f9d`](https://github.com/adobe/aepsdk-react-native/commit/52e74f9d0bb61709363a16b264afae0322fa859d)
("Content Cards & Inbox (#540)", merged 2026-04-09), re-applied onto
`main` as `840048de` (#576) the same day. The tsconfig edit was
incidental to that PR — unrelated to its actual Content Cards/Inbox
feature work.

Every package's own `tsconfig.json` extends the root one:
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": { "noEmit": false, "rootDir": "./src", "outDir": "./dist" }
}
```
None of them set `declaration` themselves, so all of them silently
inherited the loss. `declaration` is opt-in *output* generation, not a
type-check rule — removing it doesn't cause any compiler error or
warning, `tsc` just quietly stops emitting `.d.ts` files while still
emitting `.js` normally. That's why this went undetected for 5 months
across multiple releases.

### Why only some packages were affected, not "everyone on the same version"

This repo uses Lerna **independent versioning** — each package's
version number and release timing are decoupled from the others. A
package is only affected if it was actually rebuilt/published *after*
the regression landed. Verified directly against each package's git
release tag (not inferred from version numbers):

| Package (tag) | Tag commit date | Root `declaration` at that commit |
|---|---|---|
| `aepassurance@7.0.0`, `aepcampaignclassic@7.0.0`, `aepedgeidentity@7.0.0` | 2025-03-28 | present |
| `aepedgebridge@7.0.1` | 2025-05-06 | present |
| `aepplaces@7.0.1` | 2025-05-19 | present |
| `aepoptimize@7.2.0` | 2026-07-16 | **missing** |
| `aepcore@7.0.1`, `aepedge@7.0.1`, `aepedgeconsent@7.0.1`, `aeptarget@7.0.1`, `aepuserprofile@7.0.1` | 2026-09-03 | **missing** |

`aepmessaging` was never at risk regardless of timing: it builds via
`react-native-builder-bob` (`"tsc": "bob build"`) and its own
`tsconfig.json` sets `"declaration": true` explicitly, independent of
root.

### A second bug found while fixing this

The root `build` script (`npx lerna exec -- tsc`) runs the raw `tsc`
binary directly in every package directory, **bypassing each
package's own `package.json` scripts**. That's harmless for every
package whose own `"tsc"` script is just `"tsc": "tsc"`, but
`aepmessaging` defines `"tsc": "bob build"` — a semantic override
`lerna exec` never sees. On a genuinely clean checkout this produced a
flat `dist/` for `messaging` that matched none of its `main`/`types`
fields (which expect `dist/module/`, `dist/typescript/`). Fixed by
switching to `lerna run tsc`, which respects each package's own
script.

## Customer impact

Verified via `npm pack` against the real published tarballs: **6
packages are missing `.d.ts` on npm today** — `aepcore` (7.0.1),
`aepedge` (7.0.1), `aepedgeconsent` (7.0.1), `aepoptimize` (7.2.0),
`aeptarget` (7.0.1), `aepuserprofile` (7.0.1).

The actual failure mode depends on the consumer's own TypeScript
config — this is more nuanced than "the build breaks":

| Consumer setup | Result |
|---|---|
| Default React Native TS app (`allowJs: true`, from `@react-native/typescript-config` — the common case) | **No compile error.** TypeScript silently resolves the import as implicit `any`. No autocomplete, no type-checking, no compile-time typo/argument-type catching for that package — a real but silent regression. |
| A consumer with `allowJs: false` explicitly set (less common, but real) | **Hard `TS7016` build failure**: `Could not find a declaration file for module '...'`. |
| Anyone auditing dependencies with `@arethetypeswrong/cli` or similar | Flagged immediately regardless of their own config. |
| Plain JavaScript consumers, or Metro/bundler runtime either way | Unaffected — `.d.ts` is irrelevant to JS-only usage and to how Metro bundles/runs the app. |

Issue #593's reporter found this via manual `npm pack` inspection, not
a quoted compile error — consistent with the common, silent-failure
path above, not the `TS7016` path. Both are real, valid impact; the
severity differs by consumer config.

### Consumer workaround (until the patch versions below ship)

Verified via `npm pack` that each of these still has working `.d.ts`:

| Affected package | Pin to |
|---|---|
| `aepcore`, `aepedge`, `aepedgeconsent`, `aeptarget`, `aepuserprofile` | `7.0.0` |
| `aepoptimize` | `7.1.1` |

## The fix

1. **Root cause** — restored `"declaration": true` in root
   `tsconfig.json`, and additionally set it explicitly on all 11
   non-`messaging` package-level `tsconfig.json` files (defense in
   depth: a future root regression can no longer silently break every
   package at once).
2. **Build pipeline** — root `build` script changed from
   `lerna exec -- tsc` to `lerna run tsc` so `messaging`'s real build
   tool (`bob build`) always runs, on any clean checkout.
3. **Version bumps**, only for the 6 packages confirmed broken on npm
   today (peer-dep ranges are all `^7.0.0`-style, so no cascading
   bumps were needed):

   | Package | Old | New |
   |---|---|---|
   | `aepcore` | 7.0.1 | 7.0.2 |
   | `aepedge` | 7.0.1 | 7.0.2 |
   | `aepedgeconsent` | 7.0.1 | 7.0.2 |
   | `aepoptimize` | 7.2.0 | 7.2.1 |
   | `aeptarget` | 7.0.1 | 7.0.2 |
   | `aepuserprofile` | 7.0.1 | 7.0.2 |

## How this is prevented going forward

Two independent CI checks, both proven against real positive and
negative cases (simulated regression → fails with the right package
named; fixed state → passes clean), and both wired into pipelines that
already run rather than a new, easy-to-forget one:

1. **`yarn verify:types`** (root `package.json`):
   ```
   npx lerna exec --ignore aepsampleapp --ignore aepsampleappnewarchenabled --ignore baresampleapp \
     -- npx --yes @arethetypeswrong/cli --pack . --ignore-rules cjs-only-exports-default named-exports
   ```
   Runs the official `@arethetypeswrong/cli` (`attw`) tool against
   every package's real packed tarball — the same tool major projects
   like React Query and Vitest use — checking actual type resolution
   under `node10`, `node16` (CJS + ESM), and `bundler` resolution, not
   just "does a file exist." Wired into:
   - `.circleci/config.yml`'s existing `unit-test` job (runs on every
     PR into `staging`/`main` — this was already running `yarn build`
     on every PR, it just never checked what the build produced)
   - `.github/workflows/npm-publish.yml` (gates the actual publish)

   `--ignore-rules` intentionally excludes two **pre-existing, unrelated**
   findings surfaced along the way (`campaignclassic`'s CJS
   default-export shape, `messaging`'s ESM named-export interop gap in
   its Content Cards/Inbox re-exports — see below). Don't broaden this
   list to silence a future, different failure.

2. **`apps/AEPSampleApp` consumer proof** — `yarn typecheck:consumers`:
   a real, isolated import of every published `@adobe/react-native-*`
   package (`scripts/verify-consumer-types.ts`), type-checked via a
   dedicated `tsconfig.consumer-check.json` that extends the app's
   real config but forces `allowJs: false` (the default RN config's
   `allowJs: true` would otherwise silently mask a missing `.d.ts` as
   `any` instead of raising `TS7016` — see customer impact above) and
   is scoped to just that one file so the rest of the app's unrelated
   in-progress code can't block it. This is literally the same
   failure a real consumer app would hit. Wired into the CircleCI
   `unit-test` job right after `AEPSampleApp`'s dependency install.

### Known, deliberately out-of-scope findings

`attw` surfaced two real but pre-existing issues unrelated to this
regression — not fixed here, worth their own tickets:

- **`aepcampaignclassic`** — `CJSOnlyExportsDefault`: its CJS output
  sets `exports.default`/`__esModule` without also setting
  `module.exports`, which can break default-import interop under some
  ESM/bundler configs.
- **`aepmessaging`** — `NamedExports`: `src/index.ts` does
  `export * from './ui'` (the Content Cards/Inbox UI surface —
  `Inbox`, `useInbox`, `ThemeProvider`, etc.). Babel compiles that to a
  conditional re-export loop that Node's static CJS export analyzer
  (`cjs-module-lexer`) can't fully resolve, so those names aren't
  recognized as named exports under native ESM resolution — even
  though TypeScript's `.d.ts` (generated from source) says they exist.
  Only affects `node16 (from ESM)` resolution; CJS `require()` and
  bundler resolution (what Metro actually uses) are unaffected.

### Still open (not done as part of this fix)

- Nothing in this branch is committed/pushed/PR'd yet.
- GitHub branch protection requiring the CircleCI `unit-test` check to
  pass before merge is not configured — that's a repo-admin setting,
  not something achievable via a file change, and it's the actual
  mechanism that stops a future PR from quietly removing these checks.
- The two pre-existing `attw` findings above aren't fixed, only fenced
  off.
- No comment with the downgrade-workaround table has been posted to
  issue #593 yet.
