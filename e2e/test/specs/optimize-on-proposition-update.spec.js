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
 *   2. Assert the listener registration is logged (verified BEFORE triggering network).
 *   3. Trigger updatePropositions (callback variant as gate).
 *   4. Check if the onPropositionUpdate callback fires with keys.
 *
 * Registration is verified immediately after tapping the button (step 2) so
 * the test fails fast with a clear error before any network activity.
 *
 * No native SDK log assertions — pure JS-callback test.
 *
 * Decision scope under test: DecisionScope('mboxAug')
 */

const LISTENER_REGISTERED_LOG = 'Optimize.onPropositionUpdate() registered';
const LISTENER_ERROR_LOG = 'onPropositionUpdate error:';
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

    // Give the app a moment to settle after activation before first button press.
    await browser.pause(3000);

    // ── 1. Register the onPropositionUpdate listener ─────────────────────────
    await scrollAppScrollToTestIdAndClick(
      'aepsdk-app-scroll',
      'aepsdk-optimize-btn-proposition-update',
    );

    // Scroll back to top so the log panel is visible.
    await scrollAppScrollToTestId('aepsdk-app-scroll', 'aepsdk-sdk-init-status');

    // Give any immediate SDK callbacks (e.g. cached propositions) time to settle
    // before reading the log. This avoids a race between React state updates
    // (triggered by the callback) and XCUITest reading the accessibility tree.
    await browser.pause(3000);

    // ── 2. Verify listener was registered (check BEFORE triggering network) ──
    // The app now wraps Optimize.onPropositionUpdate in try-catch and logs
    // either 'registered' or 'onPropositionUpdate error: <msg>'. Checking here
    // gives an early, clear failure before any scroll confusion from step 3.
    await browser.waitUntil(
      async () => {
        const text = await logContent.getText();
        return text.includes(LISTENER_REGISTERED_LOG) || text.includes(LISTENER_ERROR_LOG);
      },
      {
        timeout: 15000,
        interval: 500,
        timeoutMsg:
          'Neither registration success nor error appeared in log within 15s. ' +
          'The button tap may not have fired. Check aepsdk-optimize-btn-proposition-update.',
      },
    );

    const afterRegisterLog = await logContent.getText();
    expect(afterRegisterLog).not.toContain(LISTENER_ERROR_LOG);
    expect(afterRegisterLog).toContain(LISTENER_REGISTERED_LOG);

    // ── 3. Trigger updatePropositions (scroll to it, tap, scroll back) ────────
    // On Android, scrolling top→bottom→top→bottom confuses UiScrollable.
    // The update-propositions-callback button is ABOVE the proposition-update
    // button we just tapped. We scrolled back to top so UiScrollable can
    // scroll DOWN to find it.
    await browser.pause(1000);

    await scrollAppScrollToTestIdAndClick(
      'aepsdk-app-scroll',
      'aepsdk-optimize-btn-update-propositions-callback',
    );

    await scrollAppScrollToTestId('aepsdk-app-scroll', 'aepsdk-sdk-init-status');

    // Wait for updatePropositions to complete
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

    // ── 4. Assert onPropositionUpdate callback fired ─────────────────────────
    // Give the callback time to fire (it's async, fires after Edge response).
    await browser.waitUntil(
      async () => ON_UPDATE_CALLBACK_LOG.test(await logContent.getText()),
      {
        timeout: 30000,
        interval: 500,
        timeoutMsg:
          'onPropositionUpdate callback did not fire within 30s after updatePropositions onSuccess. ' +
          'Check that the listener was registered and the SDK emitted the event.',
      },
    );

    const finalLog = await logContent.getText();
    expect(finalLog).toContain(LISTENER_REGISTERED_LOG);
    expect(finalLog).toMatch(UPDATE_SUCCESS_LOG);
    expect(finalLog).toMatch(ON_UPDATE_CALLBACK_LOG);
    expect(finalLog).toContain('mboxAug');
    expect(finalLog).not.toContain('onPropositionUpdate error');
  });
});
