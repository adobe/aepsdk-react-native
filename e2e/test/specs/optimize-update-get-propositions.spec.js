import { expect } from '@wdio/globals';
import {
  activateAwesomeProject,
  byTestId,
  clearCallbackLog,
  scrollAppScrollToTestId,
  scrollAppScrollToTestIdAndClick,
} from '../../helpers/rnSelectors.js';

/**
 * Validate updatePropositions + getPropositions for the Target mbox scope.
 *
 * updatePropositions is fire-and-forget — there is no direct return value.
 * Validation strategy:
 *   1. Use the callback variant (testUpdatePropositionsCallback) which logs
 *      "updatePropositions onSuccess: {payload}" when Target responds.
 *      This gives a reliable signal that the SDK cache is populated.
 *   2. Call getPropositions and assert the log contains the expected
 *      mboxAug HTML content from Target.
 *
 * Layout note (App.tsx):
 *   CallbackLogPanel (aepsdk-callback-log-content) sits ABOVE OptimizeExperienceScreen
 *   in the ScrollView. After scrolling DOWN to tap optimize buttons, the log panel
 *   is pushed off the top of the viewport and becomes invisible to UiAutomator2/XCUITest.
 *   Fix: call scrollAppScrollToTestId(..., 'aepsdk-callback-log-content') before every
 *   log read to scroll back up and bring the panel into view.
 *
 * Decision scope under test: DecisionScope('mboxAug')
 * Expected offer type:       text/html
 * Expected content fragment: 'This is a sample HTML Offer'
 */

const DECISION_SCOPE = 'mboxAug';
const TARGET_OFFER_CONTENT = 'This is a sample HTML Offer';
const UPDATE_SUCCESS_LOG = /updatePropositions onSuccess:/;
const GET_PROPOSITIONS_SIZE_LOG = /getPropositions: size=[1-9]/;

describe('Optimize updatePropositions + getPropositions (Target mbox)', function () {
  before(async function () {
    await activateAwesomeProject();

    // Wait for SDK ready before clearing log
    const sdkStatus = await $(byTestId('aepsdk-sdk-init-status'));
    await sdkStatus.waitForDisplayed({ timeout: 120000 });
    await browser.waitUntil(
      async () => (await sdkStatus.getText()).includes('ready'),
      {
        timeout: 120000,
        timeoutMsg: 'SDK did not reach ready state',
      },
    );

    // Clear log so spec assertions only see this spec's output
    await clearCallbackLog();
  });

  it('updatePropositions populates cache; getPropositions returns Target HTML offer', async function () {
    // ── 1. Call updatePropositions (callback variant) ────────────────────────
    // Scroll DOWN to reach the button (pushes log panel off screen).
    await scrollAppScrollToTestIdAndClick(
      'aepsdk-app-scroll',
      'aepsdk-optimize-btn-update-propositions-callback',
    );

    // Scroll back UP by targeting aepsdk-sdk-init-status (top of page, not nested).
    // Avoids targeting aepsdk-callback-log-content directly — it lives inside a nested
    // ScrollView (aepsdk-callback-log-scroll) which UiScrollable.scrollIntoView cannot
    // traverse from the outer scroll.
    await scrollAppScrollToTestId('aepsdk-app-scroll', 'aepsdk-sdk-init-status');
    const logContent = await $(byTestId('aepsdk-callback-log-content'));

    await browser.waitUntil(
      async () => UPDATE_SUCCESS_LOG.test(await logContent.getText()),
      {
        timeout: 60000,
        interval: 1000,
        timeoutMsg:
          `updatePropositions did not fire onSuccess within 60s. ` +
          `Check network connectivity and that '${DECISION_SCOPE}' mbox activity is live in Target.`,
      },
    );

    // ── 3. Call getPropositions ───────────────────────────────────────────────
    // Scroll DOWN again to reach the button, then scroll back UP to read the log.
    await scrollAppScrollToTestIdAndClick(
      'aepsdk-app-scroll',
      'aepsdk-optimize-btn-get-propositions',
    );
    await scrollAppScrollToTestId('aepsdk-app-scroll', 'aepsdk-sdk-init-status');

    // ── 4. Assert: size > 0 ──────────────────────────────────────────────────
    await browser.waitUntil(
      async () => GET_PROPOSITIONS_SIZE_LOG.test(await logContent.getText()),
      {
        timeout: 30000,
        interval: 500,
        timeoutMsg: 'getPropositions returned size=0 — cache may not have been populated.',
      },
    );

    // ── 5. Assert: mboxAug scope key present in payload ──────────────────────
    await browser.waitUntil(
      async () => (await logContent.getText()).includes(DECISION_SCOPE),
      {
        timeout: 30000,
        interval: 500,
        timeoutMsg: `getPropositions log did not contain decision scope '${DECISION_SCOPE}'.`,
      },
    );

    // ── 6. Assert: Target HTML offer content present ─────────────────────────
    await browser.waitUntil(
      async () => (await logContent.getText()).includes(TARGET_OFFER_CONTENT),
      {
        timeout: 30000,
        interval: 500,
        timeoutMsg:
          `getPropositions log did not contain expected offer content: '${TARGET_OFFER_CONTENT}'. ` +
          `The offer may have changed in Target or the wrong activity is live.`,
      },
    );

    const finalLog = await logContent.getText();
    expect(finalLog).not.toContain('updatePropositions onError');
    expect(finalLog).not.toContain('getPropositions error');
    expect(finalLog).toMatch(UPDATE_SUCCESS_LOG);
    expect(finalLog).toContain(TARGET_OFFER_CONTENT);
  });
});
