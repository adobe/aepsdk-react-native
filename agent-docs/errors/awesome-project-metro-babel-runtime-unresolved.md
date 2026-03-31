# Metro: unable to resolve `@babel/runtime/helpers/interopRequireDefault` (AwesomeProject)

**Status:** Fixed  
**Area:** AwesomeProject, Metro, Yarn workspace  
**Last updated:** 2025-03-23

---

## Symptom

Metro fails when bundling `./index.js`:

```text
ERROR  Error: Unable to resolve module @babel/runtime/helpers/interopRequireDefault from .../apps/AwesomeProject/index.js
@babel/runtime/helpers/interopRequireDefault could not be found within the project or in these directories:
  node_modules
  ../../node_modules
```

---

## Cause

1. **Hoisting:** Yarn installs many dependencies at the **repository root** `node_modules/`. Metro’s default `../../node_modules` from `apps/AwesomeProject` resolves to **`apps/node_modules`**, which usually does not exist, so `@babel/runtime` at the repo root is not seen.

2. **Over-broad `extraNodeModules` Proxy:** An earlier `metro.config.js` used a `Proxy` that sent **every** non-Adobe import to `apps/AwesomeProject/node_modules/<pkg>` only. Hoisted packages like `@babel/runtime` never resolved from the root.

3. **Metro project roots:** Even after pointing `extraNodeModules['@babel/runtime']` at `<repo>/node_modules/@babel/runtime`, Metro still failed until **`watchFolders`** included **`<repo>/node_modules`**. Metro only resolves files under the app root plus `watchFolders`; without listing the hoisted `node_modules` folder, paths outside the app are rejected.

---

## Fix

1. **`apps/AwesomeProject/metro.config.js`**
   - Set `watchFolders` to include:
     - `../../packages` (local Adobe sources)
     - **`../../node_modules`** (hoisted dependencies at repo root)
   - Set `resolver.nodeModulesPaths` to include the app and repo root `node_modules`.
   - Use an **explicit** `extraNodeModules` object (no catch-all `Proxy`):
     - `@adobe/react-native-aep*` → `../../packages/<folder>`
     - `@babel/runtime` → `../../node_modules/@babel/runtime`

2. **`apps/AwesomeProject/package.json`**  
   Keep `@babel/runtime` in **`dependencies`** so the app declares the runtime helpers for the bundle.

---

## Verify

```sh
yarn awesomeproject:start -- --reset-cache
```

Or:

```sh
cd apps/AwesomeProject && npx react-native bundle --platform ios --dev true --entry-file index.js --bundle-output /tmp/test.js
```

---

## Investigation log / Changelog

| Date | Note |
|------|------|
| 2025-03-23 | Resolved by explicit `extraNodeModules`, root `node_modules` in `watchFolders`, `@babel/runtime` in dependencies. |

---

## Fixed

- **Date:** 2025-03-23  
- **Summary:** Metro monorepo config + hoisted `@babel/runtime` path.  
- **Refs:** `apps/AwesomeProject/metro.config.js`, `apps/AwesomeProject/package.json`
