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
 * Validate Optimize.displayed(offers) sends a batch propositionDisplay Edge
 * event for multiple offers.
 *
 * Strategy:
 *   1. Populate cache via updatePropositions (callback variant as gate).
 *   2. Call getPropositions to confirm cache is populated.
 *   3. Start native log capture.
 *   4. Tap "Multiple Offers Displayed" which calls Optimize.displayed(offers).
 *   5. Assert callback log: displayed with N offer(s), N >= 1, no error.
 *   6. Assert native SDK logs: event names, server response, and state entries.
 *
 * Unlike Offer.displayed(proposition) which tracks a single offer,
 * Optimize.displayed(offers) is a batch API for multiple offers.
 *
 * Decision scope under test: DecisionScope('mboxAug')
 */

const UPDATE_SUCCESS_LOG = /updatePropositions onSuccess:/;
const GET_PROPOSITIONS_SIZE_NONZERO = /getPropositions: size=[1-9]/;
const DISPLAYED_MULTIPLE_LOG = /Optimize\.displayed\(\) with [1-9]\d* offer\(s\)/;
const DISPLAYED_ERROR_LOG = 'multipleOffersDisplayed error:';

describe('Optimize batch displayed (multiple offers)', function () {
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

  it('displayed sends propositionDisplay event for multiple offers', async function () {
    const logContent = await $(byTestId('aepsdk-callback-log-content'));

    // Give the app a moment to settle after activation before first button press.
    await browser.pause(3000);

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

    await browser.pause(3000);

    // ── 2. Get propositions (confirms cache populated) ───────────────────────
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
          'getPropositions returned size=0 — cache not populated.',
      },
    );

    await browser.pause(3000);

    // ── 3. Start native log capture ──────────────────────────────────────────
    await startNativeLogCapture();

    // ── 4. Tap "Multiple Offers Displayed" ───────────────────────────────────
    await scrollAppScrollToTestIdAndClick(
      'aepsdk-app-scroll',
      'aepsdk-optimize-btn-multiple-displayed',
    );

    await scrollAppScrollToTestId('aepsdk-app-scroll', 'aepsdk-sdk-init-status');

    await browser.waitUntil(
      async () => DISPLAYED_MULTIPLE_LOG.test(await logContent.getText()),
      {
        timeout: 10000,
        interval: 500,
        timeoutMsg:
          'Optimize.displayed() did not appear in log with offer count >= 1.',
      },
    );

    // ── 5. Assert callback log ───────────────────────────────────────────────
    const finalLog = await logContent.getText();
    expect(finalLog).toMatch(DISPLAYED_MULTIPLE_LOG);
    expect(finalLog).not.toContain(DISPLAYED_ERROR_LOG);

    // ── 6. Assert native SDK logs ───────────────────────────────────────────
    // Use 5s pause — the batch displayed API dispatches the Edge event async
    // and the network round-trip needs time to complete.
    await browser.pause(5000);
    const sdkLogs = await getNativeSdkLogs();

    if (!sdkLogs || sdkLogs.trim().length === 0) {
      console.error('[e2e] WARNING: Native SDK logs are EMPTY after batch displayed() call.');
      console.error('[e2e] Platform:', browser.capabilities.platformName);
    }

    expect(sdkLogs).toContain('Optimize Track Propositions Request');
    expect(sdkLogs).toContain('Edge Optimize Proposition Interaction Request');
    expect(sdkLogs).toMatch(/server response/i);
    expect(sdkLogs).toContain('activation:pull');
    expect(sdkLogs).toContain('personalization:decisions');
    expect(sdkLogs).toContain('state:store');
  });
});
