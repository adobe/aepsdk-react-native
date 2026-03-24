import { expect, $ } from '@wdio/globals';
import { activateAwesomeProject, byTestId } from '../../helpers/rnSelectors.js';

/**
 * Shared smoke spec for Android (UiAutomator2) and iOS (XCUITest).
 * Platform-specific locators and `activateApp` args live in `helpers/rnSelectors.js`.
 */
describe('AwesomeProject', () => {
  before(async () => {
    await activateAwesomeProject();
  });

  it('shows main title (aepsdk-app-title)', async () => {
    const title = await $(byTestId('aepsdk-app-title'));
    await title.waitForDisplayed({ timeout: 60000 });
    await expect(title).toHaveText('AEP AwesomeProject');
  });
});
