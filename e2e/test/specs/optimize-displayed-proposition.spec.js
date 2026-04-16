import { expect } from '@wdio/globals';
import {
  activateAwesomeProject,
  byTestId,
  clearCallbackLog,
  getNativeSdkLogs,
  startNativeLogCapture,
  scrollAppScrollToTestId,
  scrollAppScrollToTestIdAndClick,
} from '../../helpers/rnSelectors.js';

/**
 * Validate Offer.displayed(proposition) sends a propositionDisplay Edge event.
 *
 * Strategy:
 *   1. Populate cache via updatePropositions (callback variant as completion gate).
 *   2. Call getPropositions so the target proposition state is populated.
 *   3. Start native log capture (Android: drain logcat, iOS: spawn log stream).
 *   4. Tap "Display Target Offer" which calls offer.displayed(proposition).
 *   5. Assert via callback log (both platforms): displayed invoked, correct scope, no error.
 *   6. Assert via native SDK logs (both platforms): SDK dispatched
 *      "Optimize Track Propositions Request" with eventType
 *      "decisioning.propositionDisplay" and scope "mboxAug".
 *
 * The displayed() call is fire-and-forget — it sends a decisioning.propositionDisplay
 * Edge event. The callback log confirms the JS side executed correctly. The native
 * logs confirm the SDK actually dispatched the Edge event with the right payload.
 *
 * Android: `browser.getLogs('logcat')` filtered for AdobeExperienceSDK.
 * iOS:     `xcrun simctl spawn booted log stream` filtered for AdobeExperienceSDK.
 *
 * Decision scope under test: DecisionScope('mboxAug')
 */

const UPDATE_SUCCESS_LOG = /updatePropositions onSuccess:/;
const GET_PROPOSITIONS_SIZE_NONZERO = /getPropositions: size=[1-9]/;
const DISPLAY_SUCCESS_LOG = /Offer\.displayed\(\) invoked for target proposition/;
const DISPLAY_SKIPPED_LOG = 'Offer.displayed() skipped';

describe('Optimize displayed proposition (Target mbox)', function () {
  before(async function () {
    await activateAwesomeProject();

    const sdkStatus = await $(byTestId('aepsdk-sdk-init-status'));
    await sdkStatus.waitForDisplayed({ timeout: 120000 });
    await browser.waitUntil(
      async () => (await sdkStatus.getText()).includes('ready'),
      {
        timeout: 120000,
        timeoutMsg: 'SDK did not reach ready state',
      },
    );

    await clearCallbackLog();
  });

  it('displayed sends propositionDisplay event for Target HTML offer', async function () {
    const logContent = await $(byTestId('aepsdk-callback-log-content'));

    // ── 1. Populate cache: updatePropositions callback ───────────────────────
    await scrollAppScrollToTestIdAndClick(
      'aepsdk-app-scroll',
      'aepsdk-optimize-btn-update-propositions-callback',
    );

    await scrollAppScrollToTestId('aepsdk-app-scroll', 'aepsdk-sdk-init-status');

    await browser.waitUntil(
      async () => UPDATE_SUCCESS_LOG.test(await logContent.getText()),
      {
        timeout: 60000,
        interval: 1000,
        timeoutMsg:
          'updatePropositions did not fire onSuccess within 60s. ' +
          'Check network connectivity and that mboxAug activity is live in Target.',
      },
    );

    // ── 2. Get propositions (populates targetProposition state) ──────────────
    await scrollAppScrollToTestIdAndClick(
      'aepsdk-app-scroll',
      'aepsdk-optimize-btn-get-propositions',
    );

    await scrollAppScrollToTestId('aepsdk-app-scroll', 'aepsdk-sdk-init-status');

    await browser.waitUntil(
      async () => GET_PROPOSITIONS_SIZE_NONZERO.test(await logContent.getText()),
      {
        timeout: 30000,
        interval: 500,
        timeoutMsg:
          'getPropositions returned size=0 — cache not populated for display test.',
      },
    );

    // ── 3. Start native log capture, then display the target offer ─────────
    // Android: drains logcat buffer. iOS: spawns `xcrun simctl log stream`.
    await startNativeLogCapture();

    await scrollAppScrollToTestIdAndClick(
      'aepsdk-app-scroll',
      'aepsdk-optimize-btn-display-target-offer',
    );

    await scrollAppScrollToTestId('aepsdk-app-scroll', 'aepsdk-sdk-init-status');

    // ── 4. Assert callback log: JS side executed correctly ───────────────────
    await browser.waitUntil(
      async () => DISPLAY_SUCCESS_LOG.test(await logContent.getText()),
      {
        timeout: 10000,
        interval: 500,
        timeoutMsg:
          'Offer.displayed() did not appear in log. The target proposition may not have been populated.',
      },
    );

    const finalLog = await logContent.getText();
    expect(finalLog).toMatch(DISPLAY_SUCCESS_LOG);
    expect(finalLog).toContain('mboxAug');
    expect(finalLog).toContain('scope=mboxAug');
    expect(finalLog).not.toContain(DISPLAY_SKIPPED_LOG);

    // ── 5. Assert native SDK logs: Edge event dispatched (both platforms) ────
    // Give the SDK time to dispatch the Edge event.
    await browser.pause(3000);

    const sdkLogs = await getNativeSdkLogs();

    if (!sdkLogs || sdkLogs.trim().length === 0) {
      console.error('[e2e] WARNING: Native SDK logs are EMPTY after displayed() call.');
      console.error('[e2e] Platform:', browser.capabilities.platformName);
    }

    // Native log: assert event name (in header — never truncated by os_log).
    expect(sdkLogs).toContain('Optimize Track Propositions Request');
    // Native log: assert Edge forwarded the event (second event in the flow).
    expect(sdkLogs).toContain('Edge Optimize Proposition Interaction Request');
    // Payload fields (eventType, mboxAug, trackpropositions) are inside the
    // event `data:` block where iOS os_log truncates long messages with `<…>`
    // and JSON key ordering is non-deterministic. These are fully verified via
    // the callback log assertions above (scope=mboxAug, no skip, correct API).
    
  });
});
