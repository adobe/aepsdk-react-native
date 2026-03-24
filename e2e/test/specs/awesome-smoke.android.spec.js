import { expect, $ } from '@wdio/globals';
import { androidByTestId, ANDROID_APP_ID } from '../../helpers/rnSelectors.js';

/**
 * Requires AwesomeProject on the device (APK via wdio `appium:app`, or pre-installed).
 */
describe('AwesomeProject (Android)', () => {
  before(async () => {
    await browser.execute('mobile: activateApp', { appId: ANDROID_APP_ID });
  });

  it('shows main title (aepsdk-app-title)', async () => {
    const title = await $(androidByTestId('aepsdk-app-title'));
    await title.waitForDisplayed({ timeout: 60000 });
    await expect(title).toHaveText('AEP AwesomeProject');
  });
});
