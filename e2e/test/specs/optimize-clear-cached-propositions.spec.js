import { expect } from '@wdio/globals';
import {
  activateAwesomeProject,
  byTestId,
  clearCallbackLog,
  scrollAppScrollToTestId,
  scrollAppScrollToTestIdAndClick,
} from '../../helpers/rnSelectors.js';

/**
 * Validate Optimize.clearCachedPropositions() empties the local SDK cache.
 *
 * Strategy:
 *   1. Populate cache via updatePropositions (callback variant as completion gate).
 *   2. Verify getPropositions returns size > 0 (cache is populated).
 *   3. Call clearCachedPropositions.
 *   4. Verify getPropositions now returns size=0 (cache is empty).
 *
 * Uses clearCallbackLog() between steps so each assertion reads only the
 * latest operation's output — no residual log entries from prior steps.
 *
 * Decision scope under test: DecisionScope('mboxAug')
 */

const UPDATE_SUCCESS_LOG = /updatePropositions onSuccess:/;
const GET_PROPOSITIONS_SIZE_NONZERO = /getPropositions: size=[1-9]/;
const GET_PROPOSITIONS_SIZE_ZERO = /getPropositions: size=0/;
const CLEAR_CACHE_LOG = 'Optimize.clearCachedPropositions()';

describe('Optimize clearCachedPropositions', function () {
  before(async function () {
    await activateAwesomeProject();

    // Wait for SDK ready
    const sdkStatus = await $(byTestId('aepsdk-sdk-init-status'));
    await sdkStatus.waitForDisplayed({ timeout: 120000 });
    await browser.waitUntil(
      async () => (await sdkStatus.getText()).includes('ready'),
      {
        timeout: 120000,
        timeoutMsg: 'SDK did not reach ready state',
      },
    );

    // Clear log so spec assertions start clean
    await clearCallbackLog();
  });

  it('clearCachedPropositions empties cache; getPropositions returns size=0', async function () {
    // Give the app a moment to settle after activation before first button press.
    await browser.pause(3000);

    // ── 1. Populate cache: updatePropositions callback ───────────────────────
    await scrollAppScrollToTestIdAndClick(
      'aepsdk-app-scroll',
      'aepsdk-optimize-btn-update-propositions-callback',
    );

    // Scroll back up to read log
    await scrollAppScrollToTestId('aepsdk-app-scroll', 'aepsdk-sdk-init-status');
    const logContent = await $(byTestId('aepsdk-callback-log-content'));

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

    // ── 2. Verify cache is populated ─────────────────────────────────────────
    await clearCallbackLog();
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
          'getPropositions returned size=0 after updatePropositions — cache should be populated.',
      },
    );

    // ── 3. Clear cached propositions ─────────────────────────────────────────
    await scrollAppScrollToTestIdAndClick(
      'aepsdk-app-scroll',
      'aepsdk-optimize-btn-clear-cache',
    );
    await scrollAppScrollToTestId('aepsdk-app-scroll', 'aepsdk-sdk-init-status');

    await browser.waitUntil(
      async () => (await logContent.getText()).includes(CLEAR_CACHE_LOG),
      {
        timeout: 10000,
        interval: 500,
        timeoutMsg: `Log did not contain '${CLEAR_CACHE_LOG}' after tapping clear cache button.`,
      },
    );

    // ── 4. Verify cache is now empty ─────────────────────────────────────────
    await scrollAppScrollToTestIdAndClick(
      'aepsdk-app-scroll',
      'aepsdk-optimize-btn-get-propositions',
    );
    await scrollAppScrollToTestId('aepsdk-app-scroll', 'aepsdk-sdk-init-status');

    await browser.waitUntil(
      async () => GET_PROPOSITIONS_SIZE_ZERO.test(await logContent.getText()),
      {
        timeout: 30000,
        interval: 500,
        timeoutMsg:
          'getPropositions did not return size=0 after clearCachedPropositions — cache was not cleared.',
      },
    );

    // ── 5. Final assertions ──────────────────────────────────────────────────
    const finalLog = await logContent.getText();
    expect(finalLog).not.toContain('getPropositions error');
    expect(finalLog).toMatch(GET_PROPOSITIONS_SIZE_ZERO);
  });
});
