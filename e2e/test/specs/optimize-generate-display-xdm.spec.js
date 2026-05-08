import { expect } from '@wdio/globals';
import {
  activateAwesomeProject,
  byTestId,
  clearCallbackLog,
  scrollAppScrollToTestId,
  scrollAppScrollToTestIdAndClick,
} from '../../helpers/rnSelectors.js';

/**
 * Validate Optimize.generateDisplayInteractionXdm(offers) returns an XDM
 * payload containing the expected decisioning fields.
 *
 * Strategy:
 *   1. Populate cache via updatePropositions (callback variant as gate).
 *   2. Call getPropositions to confirm cache is populated.
 *   3. Tap "Multiple Offers Generate Display Interaction XDM".
 *   4. Assert callback log: XDM payload contains eventType,
 *      decisioning.propositionDisplay, scope, and activity fields.
 *
 * This API generates XDM locally — no Edge event is sent.
 * No native SDK log assertions needed.
 *
 * Decision scope under test: DecisionScope('mboxAug')
 */

const UPDATE_SUCCESS_LOG = /updatePropositions onSuccess:/;
const GET_PROPOSITIONS_SIZE_NONZERO = /getPropositions: size=[1-9]/;
const GENERATE_XDM_SUCCESS_LOG = /generateDisplayInteractionXdm: \{/;
const GENERATE_XDM_ERROR_LOG = 'generateDisplayInteractionXdm error:';

describe('Optimize generateDisplayInteractionXdm', function () {
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

  it('generateDisplayInteractionXdm returns XDM payload with expected fields', async function () {
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

    // ── 3. Tap generate display interaction XDM ──────────────────────────────
    await scrollAppScrollToTestIdAndClick(
      'aepsdk-app-scroll',
      'aepsdk-optimize-btn-generate-display-xdm',
    );

    await scrollAppScrollToTestId('aepsdk-app-scroll', 'aepsdk-sdk-init-status');

    await browser.waitUntil(
      async () => GENERATE_XDM_SUCCESS_LOG.test(await logContent.getText()),
      {
        timeout: 15000,
        interval: 500,
        timeoutMsg:
          'generateDisplayInteractionXdm did not return XDM payload. ' +
          'Check if cache is populated and offers have proposition context.',
      },
    );

    // ── 4. Assert callback log: XDM payload fields ───────────────────────────
    const finalLog = await logContent.getText();
    expect(finalLog).toMatch(GENERATE_XDM_SUCCESS_LOG);
    expect(finalLog).not.toContain(GENERATE_XDM_ERROR_LOG);

    // XDM content fields (from the working log reference)
    expect(finalLog).toContain('eventType');
    expect(finalLog).toContain('decisioning.propositionDisplay');
    expect(finalLog).toContain('_experience');
    expect(finalLog).toContain('mboxAug');
    expect(finalLog).toContain('563703');
  });
});
