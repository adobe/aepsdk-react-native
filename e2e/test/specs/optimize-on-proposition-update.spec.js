import { expect } from '@wdio/globals';
import {
  activateAwesomeProject,
  byTestId,
  clearCallbackLog,
  scrollAppScrollToTestId,
  scrollAppScrollToTestIdAndClick,
} from '../../helpers/rnSelectors.js';

/**
 * Validate Optimize.onPropositionUpdate() registers a listener.
 *
 * Strategy:
 *   1. Register the onPropositionUpdate listener.
 *   2. Assert the listener registration is logged.
 *   3. Trigger updatePropositions (callback variant as gate).
 *   4. Check if the onPropositionUpdate callback fires with keys.
 *
 * NOTE: The listener registers successfully, but as of the current turbo
 * module implementation the callback may not fire after updatePropositions.
 * The test hard-asserts registration and soft-checks the callback.
 *
 * No native SDK log assertions — pure JS-callback test.
 *
 * Decision scope under test: DecisionScope('mboxAug')
 */

const LISTENER_REGISTERED_LOG = 'Optimize.onPropositionUpdate() registered';
const UPDATE_SUCCESS_LOG = /updatePropositions onSuccess:/;
const ON_UPDATE_CALLBACK_LOG = /onPropositionUpdate callback: keys=\[/;

describe('Optimize onPropositionUpdate listener', function () {
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

  it('onPropositionUpdate listener registers and callback behavior is verified', async function () {
    const logContent = await $(byTestId('aepsdk-callback-log-content'));

    // ── 1. Register the onPropositionUpdate listener ─────────────────────────
    await scrollAppScrollToTestIdAndClick(
      'aepsdk-app-scroll',
      'aepsdk-optimize-btn-proposition-update',
    );

    // ── 2. Trigger updatePropositions IMMEDIATELY (don't scroll to top first).
    // On Android, scrolling top→bottom→top→bottom confuses UiScrollable.
    // The update-propositions-callback button (#3) is ABOVE the proposition-update
    // button (#8) we just tapped. Scroll to top first so UiScrollable can
    // scroll DOWN to find #3.
    await scrollAppScrollToTestId('aepsdk-app-scroll', 'aepsdk-sdk-init-status');

    // Small pause to let UiScrollable settle after the long scroll
    await browser.pause(1000);

    await scrollAppScrollToTestIdAndClick(
      'aepsdk-app-scroll',
      'aepsdk-optimize-btn-update-propositions-callback',
    );

    // ── 3. Scroll to top to read the log ─────────────────────────────────────
    await scrollAppScrollToTestId('aepsdk-app-scroll', 'aepsdk-sdk-init-status');

    // First verify listener was registered
    await browser.waitUntil(
      async () => (await logContent.getText()).includes(LISTENER_REGISTERED_LOG),
      {
        timeout: 10000,
        interval: 500,
        timeoutMsg:
          'onPropositionUpdate listener was not registered.',
      },
    );

    // Then wait for updatePropositions to complete
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

    // ── 4. Check if onPropositionUpdate callback fired (soft check) ──────────
    // Give the callback time to fire (it's async, fires after Edge response).
    await browser.pause(5000);

    const finalLog = await logContent.getText();
    expect(finalLog).toContain(LISTENER_REGISTERED_LOG);
    expect(finalLog).toMatch(UPDATE_SUCCESS_LOG);

    if (ON_UPDATE_CALLBACK_LOG.test(finalLog)) {
      console.log('[e2e] ✓ onPropositionUpdate callback fired');
      expect(finalLog).toMatch(ON_UPDATE_CALLBACK_LOG);
      expect(finalLog).toContain('mboxAug');
    } else {
      throw new Error('onPropositionUpdate callback did not fire');
      //console.warn('[e2e] ⚠ onPropositionUpdate callback did not fire (known turbo module limitation). Listener registration verified.');
    }

    expect(finalLog).not.toContain('onPropositionUpdate error');
  });
});
