# Android E2E — element not found after scrolling (off-screen = absent from hierarchy)

**Status:** Fixed
**Area:** Android E2E, UiAutomator2, wdio specs
**Last updated:** 2026-03-31

---

## Symptom

Two related failures:

### Failure 1: All specs fail — app title not displayed
```
element ("android=new UiSelector().resourceId("aepsdk-app-title")") still not displayed after 60000ms
```
Even the smoke test fails. Happens when the app was left running from a previous session with the scroll position deep in the page.

### Failure 2: Spec-specific — log content not found after deep scroll
```
Error: waitUntil condition failed with the following reason:
Can't call getElementText on element with selector
"android=new UiSelector().resourceId("aepsdk-callback-log-content")"
because element wasn't found
```
Happens within a spec that scrolls down to tap a button, then tries to read the log panel above.

---

## Environment

- Platform: Android, UiAutomator2
- App: AwesomeProject release APK
- Spec: all specs (failure 1), `optimize-update-get-propositions.spec.js` (failure 2)

---

## Cause

Two separate issues, same root principle: **UiAutomator2 only surfaces elements within the current viewport**. Elements scrolled off-screen are absent from the element hierarchy — `findElement` returns nothing.

### Cause 1: stale app state between sessions
`wdio.android.conf.js` had `appium:noReset: true` but no `appium:forceAppLaunch`. When Appium started a new session, it brought the existing app to the foreground **without restarting**. The scroll position and UI state from the previous session persisted, leaving the title and top-of-page elements off-screen.

### Cause 2: scroll position within a spec
In `App.tsx`, `CallbackLogPanel` (`aepsdk-callback-log-content`) is rendered **above** `OptimizeExperienceScreen`. When a spec scrolls DOWN to reach an optimize button, the log panel scrolls off the top and disappears.

Additional subtlety: `aepsdk-callback-log-content` is inside a **nested** `ScrollView` (`aepsdk-callback-log-scroll`). `UiScrollable.scrollIntoView` targeting this element directly fails because UiScrollable can't traverse nested scroll containers from the outer scroll. Solution: scroll to `aepsdk-sdk-init-status` (a non-nested element at the top of the page) to bring the whole top section (including the log panel) back into view.

Layout (App.tsx scroll order):
```
ScrollView (aepsdk-app-scroll)
  ├── aepsdk-app-title
  ├── aepsdk-sdk-init-status
  ├── Core / Assurance buttons
  ├── CallbackLogPanel             ← aepsdk-callback-log-content (inside nested ScrollView)
  └── OptimizeExperienceScreen     ← buttons scrolled TO (deep below)
```

---

## Fix

### Fix 1: `appium:forceAppLaunch: true` in wdio.android.conf.js
Forces the app to restart at the beginning of each Appium session. This ensures a clean scroll position (top of page) regardless of prior state.

```js
'appium:noReset': true,
'appium:forceAppLaunch': true,     // ← added
```

### Fix 2: `scrollAppScrollToTestId` helper in specs
After tapping a deep button, scroll back up before reading the log:

```js
// After scrolling down to tap a button:
await scrollAppScrollToTestIdAndClick('aepsdk-app-scroll', 'aepsdk-optimize-btn-update-propositions-callback');

// Scroll back up via a non-nested element at the top:
await scrollAppScrollToTestId('aepsdk-app-scroll', 'aepsdk-sdk-init-status');

// Now safe to read the log:
const logContent = await $(byTestId('aepsdk-callback-log-content'));
```

**Important:** Target `aepsdk-sdk-init-status` (not `aepsdk-callback-log-content`) because the log text is inside a nested ScrollView that UiScrollable can't reach from the outer scroll.

---

## Verify

```sh
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && ANDROID_CONFIGURATION=release yarn e2e:android
```

Expected: all 3 specs pass (34s total).

---

## Fixed

- **Date:** 2026-03-31
- **Summary:** Added `appium:forceAppLaunch: true` to wdio.android.conf.js; added `scrollAppScrollToTestId` helper; updated spec to scroll to `aepsdk-sdk-init-status` before reading log
