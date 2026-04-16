# iOS Native Log Capture Learnings

**Last updated:** 2026-04-16

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

## Final working solution

### `startNativeLogCapture()` (iOS path)

```javascript
// Host Mac log stream — NOT simctl spawn
spawn('/usr/bin/log', [
  'stream',
  '--level', 'debug',
  '--style', 'ndjson',
  '--predicate', 'subsystem == "com.adobe.mobile.marketing.aep" AND process == "AwesomeProject"',
]);

await sleep(2000);  // wait for stream to attach
```

### `getNativeSdkLogs()` (iOS path)

1. Kill the stream process (SIGTERM → 1s pause → SIGKILL fallback)
2. Parse ndjson lines, extract `eventMessage` fields
3. Persist raw logs to `e2e/logs/ios_native_sdk_logs.txt` for debugging
4. Return concatenated messages for assertion

### Test timing

- `browser.pause(3000)` before collecting logs — gives the SDK time to dispatch the Edge event
- The native log assertions check these strings on both platforms:
  - `"Optimize Track Propositions Request"` — event name (early in message)
  - `"decisioning.propositionDisplay"` or `"decisioning.propositionInteract"` — event type (early)
  - `"trackpropositions"` — request type (early)
- **NOT asserted in native logs:** `"mboxAug"` (scope name) — os_log truncates long
  messages with `<…>`, and `propositions[].scope` is deep enough to be cut off.
  Assert `mboxAug` via the **callback log** instead (JS-level, never truncated).

---

## File logging approach

All iOS native log captures are persisted to:

```
e2e/logs/ios_native_sdk_logs.txt
```

- **Append mode**: each capture adds a timestamped section header
- File is created if missing; directory is created if missing
- Works across multiple test runs — logs accumulate
- Useful for post-mortem debugging when assertions fail

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

**Always reliable (assert with `expect().toContain()`):**
- Event names in headers: `Optimize Track Propositions Request`, `Edge Optimize Proposition Interaction Request`
- Short Info-level messages: `Handle server response with streaming enabled`
- Response event types (short data): `activation:pull`, `personalization:decisions`, `state:store`

**Unreliable — use soft checks only (if/else with console.log/warn):**
- `decisioning.propositionDisplay` / `propositionInteract` — survives ~75% of runs
- `mboxAug` — survives ~75% of runs
- `trackpropositions` — survives ~50% of runs

**Never visible in `log stream` (Debug-level, Xcode-only):**
- `EdgeNetworkService - Sending request to URL` (with full request body)
- `Initiated (POST) network request`
- `Connection to Experience Edge was successful`
- `Edge - Queuing event with id`

Debug-level `os_log` messages are only emitted when a debugger (Xcode/lldb) is attached. `log stream` runs without a debugger, so these are invisible. The server response assertion (`Handle server response`) confirms the POST succeeded.

**Rule:** Hard-assert reliable strings. Soft-check unreliable strings (log ✓ if found, ⚠ if not). Verify all payload fields via the callback log (JS-level, never truncated).

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
