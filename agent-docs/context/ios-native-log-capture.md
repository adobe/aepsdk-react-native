# iOS Native Log Capture Learnings

**Last updated:** 2026-04-14

> Lessons from making native SDK log capture work reliably on iOS for e2e tests.

---

## Why iOS log capture failed initially

The original implementation used this predicate:

```
process == "AwesomeProject" AND subsystem == "com.adobe.mobile.marketing.aep"
```

This was **too restrictive**. The AEP SDK on iOS uses `os_log` under **multiple subsystems** — not a single one. The Optimize extension, Edge extension, Core, and Messaging each log under different subsystems. The `AND subsystem ==` clause filtered out most of the logs we needed for assertions.

---

## Android logcat vs iOS os_log — key differences

| Aspect | Android logcat | iOS os_log / log stream |
|--------|---------------|------------------------|
| Tag model | Single `AdobeExperienceSDK` tag for all SDK logs | Multiple os_log subsystems per extension |
| API | `browser.getLogs('logcat')` via Appium | `xcrun simctl spawn <udid> log stream` as child process |
| Buffering | Ringbuffer, always available, drain-and-read | Stream-based, must be actively listening to capture |
| Filtering | Post-filter on `AdobeExperienceSDK` in message | Predicate at spawn time (pre-filter) + post-filter |
| Timing | Entries available immediately | Stream needs 1–2s to attach, logs can be buffered |
| Process targeting | N/A (logcat captures all processes) | Must filter by process name or PID |

---

## Predicate pitfalls

1. **`subsystem == "com.adobe.mobile.marketing.aep"`** — misses Optimize, Edge, and other extension logs that use different subsystems.

2. **`eventMessage CONTAINS "keyword"`** — fragile in streaming predicates; log daemon may not evaluate complex predicates correctly when the stream starts mid-buffer. Better to use a broad predicate and post-filter.

3. **`process == "AwesomeProject"`** — this is the **reliable** filter. The app binary name is always "AwesomeProject" regardless of which SDK extension is logging.

4. **`"booted"` as device target** — can be ambiguous when multiple simulators exist. Resolving the explicit UDID from `xcrun simctl list devices booted -j` avoids targeting the wrong device.

---

## Buffering issues

- `xcrun simctl spawn <udid> log stream` has **startup latency**: it needs ~1–2s after spawn before the first log events flow. Actions performed before the stream attaches produce logs that are silently lost.

- After killing the stream process (`SIGTERM`), there may be buffered data that hasn't been read from stdout yet. A 1s delay after kill lets the Node.js stream callbacks flush.

- Using `--style ndjson` makes output machine-parseable: each line is a JSON object with `eventMessage`, `subsystem`, `processImagePath`, etc. This avoids regex-parsing human-readable log format.

---

## Final working solution

### `startNativeLogCapture()` (iOS path)

```javascript
const udid = _getBootedSimulatorUdid();  // explicit UDID, not "booted"

spawn('xcrun', [
  'simctl', 'spawn', udid, 'log', 'stream',
  '--level', 'debug',
  '--style', 'ndjson',
  '--predicate', 'process == "AwesomeProject"',  // broad: no subsystem filter
]);

await sleep(2000);  // wait for stream to attach
```

### `getNativeSdkLogs()` (iOS path)

1. Kill the stream process (SIGTERM → 1s pause → SIGKILL fallback)
2. Parse ndjson lines, extract `eventMessage` fields
3. Persist raw logs to `e2e/logs/ios_native_sdk_logs.txt` for debugging
4. Return concatenated messages for assertion

### Test timing

- `browser.pause(3000)` before collecting logs (was 2000) — iOS os_log buffering adds latency vs Android logcat
- The test assertions check the same strings on both platforms:
  - `"Optimize Track Propositions Request"` — event name
  - `"decisioning.propositionInteract"` — event type
  - `"mboxAug"` — decision scope
  - `"trackpropositions"` — request type

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
# Stream all AwesomeProject logs to file
xcrun simctl spawn booted log stream --level debug \
  --predicate 'process == "AwesomeProject"' > ios_logs.txt

# Stream + view simultaneously
xcrun simctl spawn booted log stream --level debug \
  --predicate 'process == "AwesomeProject"' | tee ios_logs.txt

# Filtered to Adobe SDK subsystem (may miss some entries)
xcrun simctl spawn booted log stream --level debug \
  --predicate 'process == "AwesomeProject" AND subsystem CONTAINS "adobe"' \
  | tee ios_logs.txt
```

---

## Debugging empty logs

If `getNativeSdkLogs()` returns empty on iOS:

1. **Check simulator state**: `xcrun simctl list devices booted` — is a simulator running?
2. **Check process name**: the binary must be `AwesomeProject` — if renamed, update the predicate
3. **Check log file**: look at `e2e/logs/ios_native_sdk_logs.txt` for raw output
4. **Increase startup delay**: try 3000ms instead of 2000ms in `startNativeLogCapture`
5. **Manual test**: run `xcrun simctl spawn booted log stream --predicate 'process == "AwesomeProject"'` in terminal, then trigger the action in the app — do logs appear?
6. **Check `IOS_UDID` env var**: if set to wrong value, stream targets wrong device
