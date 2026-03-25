import { expect } from '@wdio/globals';
import {
  activateAwesomeProject,
  byTestId,
  scrollAppScrollToTestIdAndClick,
} from '../../helpers/rnSelectors.js';

/** Success line from `appendLog`; native semver may differ from npm `@adobe/react-native-aepoptimize`. */
const OPTIMIZE_VERSION_SUCCESS =
  /Optimize\.extensionVersion\(\)\s*=>\s*(\d+\.\d+\.\d+)/;

describe('Optimize extension version', function () {
  before(async function () {
    await activateAwesomeProject();
  });

  it('logs extension version to callback panel (no error)', async function () {
    const sdkStatus = await $(byTestId('aepsdk-sdk-init-status'));
    await sdkStatus.waitForDisplayed({ timeout: 120000 });
    await browser.waitUntil(
      async () => (await sdkStatus.getText()).includes('ready'),
      {
        timeout: 120000,
        timeoutMsg: 'SDK did not reach ready (MobileCore.initializeWithAppId)',
      },
    );

    await scrollAppScrollToTestIdAndClick(
      'aepsdk-app-scroll',
      'aepsdk-optimize-btn-extension-version',
    );

    const logContent = await $(byTestId('aepsdk-callback-log-content'));
    await browser.waitUntil(
      async () => {
        const t = await logContent.getText();
        return OPTIMIZE_VERSION_SUCCESS.test(t);
      },
      {
        timeout: 30000,
        interval: 500,
        timeoutMsg:
          'Expected log to contain Optimize.extensionVersion() => x.y.z after tapping the button',
      },
    );

    const text = await logContent.getText();
    expect(text).not.toContain('Optimize.extensionVersion error');
    expect(text).toMatch(OPTIMIZE_VERSION_SUCCESS);
  });
});
