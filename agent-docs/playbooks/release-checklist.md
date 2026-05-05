# Playbook: Release Checklist

**Last updated:** 2026-03-30

> Checklist for cutting a new AEP React Native package release.

---

## Pre-release

- [ ] All target APIs migrated and E2E tests passing (both turbo + interop paths)
- [ ] Unit tests green: `yarn test`
- [ ] `CHANGELOG.md` updated for the package(s) being released
- [ ] Version bumped in `package.json` for each affected package
- [ ] No merge freeze in effect (check with team before staging → main)

---

## Build verification

- [ ] `yarn install` from repo root — no resolution errors
- [ ] iOS: `yarn e2e:ios:build:turbo` passes
- [ ] Android: `yarn e2e:android:build` passes
- [ ] Expo smoke test if Expo-related changes were made (see `docs/expo.md`)

---

## Merge flow

```
feature branch → staging → main
```

- PRs go to `staging` first
- `staging → main` is the release PR (triggers npm publish workflow)
- npm publish workflow uses Node version pinned in `.github/workflows/` — do not change without testing

---

## Post-release

- [ ] Verify package published on npm: `npm view @adobe/react-native-aep<module> version`
- [ ] Tag created on main
- [ ] Update any open issues / tickets referencing the release

---

## Known CI notes

- Node version for npm publish is set in `.github/workflows/` (was updated in commit `update node-version for npm publish workflow`)
- If publish fails, check the node-version field in the publish workflow YAML
