# iOS Native Log Capture Learnings

**Last updated:** 2026-05-08

> Lessons from making native SDK log capture work reliably on iOS for e2e tests.

---

## Key discovery: host `log stream` vs `simctl spawn`

The AEP SDK on iOS **does** emit logs via `os_log` under a **single** subsystem: `com.adobe.mobile.marketing.aep`. Categories vary by extension (e.g. `AEP SDK DEBUG - <RCTAEPOptimize>`, `AEP SDK TRACE - <EventHub>`, `AEP SDK DEBUG - <AEPEdge>`).

**Critical distinction:**

| Approach | Sees AEP SDK logs? | Why |
|----------|-------------------|-----|
| `xcrun simctl spawn <udid> log stream` | **NO** | Runs inside the simulator sandbox — does not see app-level os_log entries |
| `/usr/bin/log stream` (host Mac) | **YES** | Captures the unified log including all simulator processes |

This was the root cause of all iOS native log capture failures. The logs exist — `simctl spawn` just can't see them.

---

## Predicate selection

| Predicate | Result |
|-----------|--------|
| `process == "AwesomeProject"` | Too broad — floods with XCUITest accessibility noise (scroll.bar.vertical, page.count, AX element queries, CFPrefsSearchListSource). Thousands of entries, zero AEP SDK content. |
| `subsystem == "com.adobe.mobile.marketing.aep"` | Correct filter — captures only AEP SDK entries. Add `AND process == "AwesomeProject"` to scope to the test app. |

---

## Android logcat vs iOS os_log — key differences

| Aspect | Android logcat | iOS os_log / log stream |
|--------|---------------|------------------------|
| Tag model | Single `AdobeExperienceSDK` tag for all SDK logs | Single subsystem `com.adobe.mobile.marketing.aep`, categories per extension |
| API | `browser.getLogs('logcat')` via Appium | `/usr/bin/log stream` as child process on the host Mac |
| Buffering | Ringbuffer, always available, drain-and-read | Stream-based, must be actively listening to capture |
| Filtering | Post-filter on `AdobeExperienceSDK` in message | Predicate at spawn time (pre-filter by subsystem) |
| Timing | Entries available immediately | Stream needs 1–2s to attach, logs can be buffered |

---

## Cross-platform log message differences

The AEP SDK uses different log message wording on iOS vs Android for the same events. Always use regex or platform-agnostic substrings:

| Event | iOS message | Android message | Safe pattern |
|-------|------------|-----------------|--------------|
| Edge response received | `Handle server response with streaming enabled` | `Received server response` | `/server response/i` |
| Event dispatch | `Dispatching Event #Optional(N)` | `Dispatching Event #N` | `Dispatching Event` |

**Rule:** Never hard-code `Handle server response with streaming enabled` — it fails on Android. Use `expect(sdkLogs).toMatch(/server response/i)`.

---

## Final working solution

### `startNativeLogCapture()` (iOS path)

```javascript
// Host Mac log stream — NOT simctl spawn
spawn('/usr/bin/log', [
  'stream',
  '--level', 'debug',
  '--style', 'compact',
  '--predicate', 'subsystem == "com.adobe.mobile.marketing.aep" AND process == "AwesomeProject"',
]);

await sleep(2000);  // wait for stream to attach
```

### `getNativeSdkLogs()` (iOS path)

1. Kill the stream process (SIGTERM → 1s pause → SIGKILL fallback)
2. Run `log show --last 60s` as a fallback (catches anything the stream missed)
3. Merge stream buffer + `log show` output for maximum coverage
4. Persist two dump files for debugging:
   - `e2e/logs/ios_native_sdk_logs_raw.txt` — full unfiltered stream buffer
   - `e2e/logs/ios_native_sdk_logs.txt` — AEP-subsystem-filtered entries (timestamped sections, append mode)
5. Return merged string for assertion

### Test timing

- `browser.pause(3000)` before collecting logs — gives the SDK time to dispatch the Edge event
- All native log assertions use hard `expect().toContain()` / `expect().toMatch()` on both platforms:
  - `"Optimize Track Propositions Request"` — event name (in header)
  - `"Edge Optimize Proposition Interaction Request"` — forwarded to Edge
  - `/server response/i` — Edge round-trip completed (regex: iOS says "Handle server response", Android says "Received server response")
  - `"activation:pull"`, `"personalization:decisions"`, `"state:store"` — response event types
- **NOT asserted in native logs:** `"mboxAug"`, `"decisioning.propositionDisplay"`, `"trackpropositions"` — os_log truncates long messages with `<…>` and JSON key ordering is non-deterministic. Assert these via the **callback log `nativePayload:`** (JS-level, never truncated).

---

## File logging approach

iOS native log captures are persisted to two files:

```
e2e/logs/ios_native_sdk_logs_raw.txt   # Full unfiltered stream buffer (all lines)
e2e/logs/ios_native_sdk_logs.txt       # AEP-subsystem-filtered entries
```

- **Append mode**: each capture adds a timestamped section header
- Files are created if missing; directory is created if missing
- Works across multiple test runs — logs accumulate
- `ios_native_sdk_logs_raw.txt` is the authoritative debug file — it always has content even if the AEP predicate missed entries
- Both files are gitignored

### Manual log capture (terminal)

```bash
# Stream AEP SDK logs from simulator (on host Mac)
/usr/bin/log stream --level debug \
  --predicate 'subsystem == "com.adobe.mobile.marketing.aep" AND process == "AwesomeProject"'

# Stream + view simultaneously
/usr/bin/log stream --level debug \
  --predicate 'subsystem == "com.adobe.mobile.marketing.aep" AND process == "AwesomeProject"' \
  | tee ios_logs.txt
```

---

## os_log message truncation

`os_log` on iOS truncates long messages with `<…>` regardless of output format (`compact`, `ndjson`, etc.). This is a system-level limit, not a format issue.

**Impact on assertions:** Two categories of log data have different reliability:

**Always reliable — hard assert with `expect().toContain()` / `expect().toMatch()`:**
- Event names in headers: `Optimize Track Propositions Request`, `Edge Optimize Proposition Interaction Request`
- Response: `/server response/i` (regex — iOS and Android use different wording)
- Response event types: `activation:pull`, `personalization:decisions`, `state:store`

**Unreliable in native logs — assert via callback log `nativePayload:` instead:**
- `decisioning.propositionDisplay` / `propositionInteract` — JSON key ordering non-deterministic
- `mboxAug` — deep in the propositions array, often truncated
- `trackpropositions` — inside `data:` block, may be cut off

The app logs the full proposition data to the callback log (JS-level) via `nativePayload:` BEFORE calling the native fire-and-forget API. Hard-assert these fields via callback log — it is never truncated.

**Never visible in `log stream` (Debug-level, Xcode-only):**
- `EdgeNetworkService - Sending request to URL` (with full request body)
- `Initiated (POST) network request`
- `Connection to Experience Edge was successful`
- `Edge - Queuing event with id`

Debug-level `os_log` messages are only emitted when a debugger (Xcode/lldb) is attached. `log stream` runs without a debugger, so these are invisible. The server response assertion (`/server response/i`) confirms the POST succeeded.

**Rule:** Hard-assert event names and response strings in native logs. Assert payload fields (scope, eventType, requestType) via callback log `nativePayload:`. Do NOT use soft checks (`console.warn`) for native log assertions — all assertions are hard on both iOS and Android.

---

## Debugging empty logs

If `getNativeSdkLogs()` returns empty on iOS:

1. **Check you're using `/usr/bin/log stream`** — NOT `xcrun simctl spawn`. `simctl spawn` cannot see AEP SDK os_log entries.
2. **Check simulator state**: `xcrun simctl list devices booted` — is a simulator running?
3. **Check process name**: the binary must be `AwesomeProject` — if renamed, update the predicate
4. **Check subsystem predicate**: must be `com.adobe.mobile.marketing.aep` (not `com.adobe.*` or process-only)
5. **Check log file**: look at `e2e/logs/ios_native_sdk_logs.txt` for raw output
6. **Increase startup delay**: try 3000ms instead of 2000ms in `startNativeLogCapture`
7. **Manual test**: run the host `log stream` command above in terminal, then trigger the action in the app — do logs appear?
