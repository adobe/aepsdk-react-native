# iOS E2E — scroll gesture intercepted by nested WebView / scrollable container

**Status:** Fixed
**Area:** iOS E2E, XCUITest, wdio specs, rnSelectors.js
**Last updated:** 2026-03-31

---

## Symptom

```
Error: [e2e] Could not scroll to testID "aepsdk-optimize-btn-update-propositions-callback" inside "aepsdk-app-scroll" (iOS)
```

The `scrollAppScrollToTestIdAndClick` function swipes 40 times but the target element never becomes visible. The app appears to scroll briefly then stop, or not scroll the outer `ScrollView` at all. Manually swiping in the upper part of the screen works fine.

Similarly, `scrollAppScrollToTestId` (scroll back up) fails to bring the top-of-page elements back into view — the swipe gesture gets trapped in the HTML offer WebView.

---

## Environment

- Platform: iOS simulator, XCUITest
- App: AwesomeProject (Debug build on iPhone 16 simulator)
- Spec: `optimize-update-get-propositions.spec.js`

---

## Cause

Two compounding issues:

### 1. `mobile: swipe` targeted at the scroll element lands on a nested scrollable container

The original iOS scroll helpers used `mobile: swipe` with `elementId` set to the outer `ScrollView` (`aepsdk-app-scroll`). XCUITest dispatches the gesture at the **center** of the element's visible bounds. When the page is scrolled to the middle, the center of the visible area often falls on the **HTML offer WebView** — a nested scrollable container that consumes the gesture instead of passing it to the outer `ScrollView`.

App layout (from `App.tsx`):
```
ScrollView (aepsdk-app-scroll)
  ├── aepsdk-app-title
  ├── aepsdk-sdk-init-status
  ├── Core / Assurance buttons
  ├── CallbackLogPanel (nested ScrollView)
  └── OptimizeExperienceScreen
        ├── buttons (update/get propositions, etc.)
        └── FlatList with offer rows
              └── HTML Offer row → WebView (nested scrollable!)
```

### 2. `direction: 'up'` only scrolls content downward (one direction)

The original implementation only swiped in one direction (`direction: 'up'` = content moves down to reveal items below). If the target element was **above** the current viewport, 40 downward swipes would never find it. Android's `UiScrollable.scrollIntoView` searches bidirectionally, but the iOS manual swipe loop did not.

---

## Fix

Replaced `mobile: swipe` with **coordinate-based `performActions`** in the upper portion of the screen (15–45% from top). This avoids the nested WebView/ScrollView containers that sit in the middle-to-lower area of the page.

Key changes in `e2e/helpers/rnSelectors.js`:

### `scrollAppScrollToTestIdAndClick` (scroll down to find + tap)
```js
// Swipe UP in upper quarter (startY: 45% → endY: 15%) to scroll content down
const { width, height } = await browser.getWindowRect();
const x = Math.floor(width / 2);
const startY = Math.floor(height * 0.45);
const endY = Math.floor(height * 0.15);
await browser.performActions([{
  type: 'pointer', id: 'finger1',
  parameters: { pointerType: 'touch' },
  actions: [
    { type: 'pointerMove', duration: 0, x, y: startY },
    { type: 'pointerDown', button: 0 },
    { type: 'pause', duration: 300 },
    { type: 'pointerMove', duration: 600, x, y: endY },
    { type: 'pointerUp', button: 0 },
  ],
}]);
await browser.releaseActions();
```

### `scrollAppScrollToTestId` (scroll back up to reveal log panel)
```js
// Swipe DOWN in upper quarter (startY: 15% → endY: 45%) to scroll content up
// Same structure, reversed startY/endY
```

### Why this works
- **Upper screen region** (15–45%): at app launch, this area contains the title, SDK status, and plain buttons — no nested scrollable containers. Even after scrolling, the upper portion is safe.
- **`performActions` with coordinates**: bypasses element-based gesture dispatch entirely, so no nested container can intercept.
- **Slow, deliberate gesture** (`pause: 300ms`, `move: 600ms`): more reliable than the rapid `velocity: 2500` swipes that sometimes didn't register.

---

## Verify

```sh
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && yarn e2e:ios
```

Expected: all 3 specs pass.

---

## Fixed

- **Date:** 2026-03-31
- **Summary:** Replaced `mobile: swipe` on scroll element with coordinate-based `performActions` in the upper screen region to avoid nested WebView/ScrollView intercepting the gesture
