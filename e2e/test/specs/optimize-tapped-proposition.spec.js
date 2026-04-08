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
 * Validate Offer.tapped(proposition) sends a propositionInteract Edge event.
 *
 * Strategy:
 *   1. Populate cache via updatePropositions (callback variant as completion gate).
 *   2. Call getPropositions so the target proposition state is populated.
 *   3. Start native log capture (Android: drain logcat, iOS: spawn log stream).
 *   4. Tap "Tap Target Offer" button which calls offer.tapped(proposition).
 *   5. Assert via callback log: tap invoked, correct scope, no error.
 *   6. Assert via native SDK logs (both platforms): SDK dispatched
 *      "Optimize Track Propositions Request" with eventType
 *      "decisioning.propositionInteract" and scope "mboxAug".
 *
 * The tapped() call is fire-and-forget — it sends a decisioning.propositionInteract
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
const TAP_SUCCESS_LOG = /Offer\.tapped\(\) invoked for target proposition/;
const TAP_SKIPPED_LOG = 'Offer.tapped() skipped';

describe('Optimize tapped proposition (Target mbox)', function () {
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

  it('tapped sends propositionInteract event for Target HTML offer', async function () {
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
          'getPropositions returned size=0 — cache not populated for tap test.',
      },
    );

    // ── 3. Start native log capture, then tap the target offer ───────────────
    // Android: drains logcat buffer. iOS: spawns `xcrun simctl log stream`.
    await startNativeLogCapture();

    await scrollAppScrollToTestIdAndClick(
      'aepsdk-app-scroll',
      'aepsdk-optimize-btn-tap-target-offer',
    );

    await scrollAppScrollToTestId('aepsdk-app-scroll', 'aepsdk-sdk-init-status');

    // ── 4. Assert callback log: JS side executed correctly ───────────────────
    await browser.waitUntil(
      async () => TAP_SUCCESS_LOG.test(await logContent.getText()),
      {
        timeout: 10000,
        interval: 500,
        timeoutMsg:
          'Offer.tapped() did not appear in log. The target proposition may not have been populated.',
      },
    );

    const finalLog = await logContent.getText();
    expect(finalLog).toMatch(TAP_SUCCESS_LOG);
    expect(finalLog).toContain('mboxAug');
    expect(finalLog).not.toContain(TAP_SKIPPED_LOG);

    // ── 5. Assert native SDK logs: Edge event dispatched (both platforms) ────
    // Give the SDK a moment to dispatch the event
    await browser.pause(2000);

    const sdkLogs = await getNativeSdkLogs();
    expect(sdkLogs).toContain('Optimize Track Propositions Request');
    expect(sdkLogs).toContain('decisioning.propositionInteract');
    expect(sdkLogs).toContain('mboxAug');
    expect(sdkLogs).toContain('trackpropositions');
  });
});
