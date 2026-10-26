jest.mock('../src/NativeAEPCampaignClassic', () => ({
  __esModule: true,
  default: {
    extensionVersion: jest.fn().mockResolvedValue('1.0.0'),
    registerDeviceWithToken: jest.fn(),
    trackNotificationClickWithUserInfo: jest.fn(),
    trackNotificationReceiveWithUserInfo: jest.fn()
  }
}));

import NativeAEPCampaignClassic from '../src/NativeAEPCampaignClassic';
import { CampaignClassic } from '../src';

describe('Campaign Classic', () => {
  it('should return extension version', async () => {
    const spy = NativeAEPCampaignClassic.extensionVersion;
    const version = await CampaignClassic.extensionVersion();
    expect(spy).toHaveBeenCalled();
    expect(version).toMatch('1.0.0');
  });

  it('should register devices passed', () => {
    const spy = NativeAEPCampaignClassic.registerDeviceWithToken;
    CampaignClassic.registerDeviceWithToken('myToken', 'userKey');
    expect(spy).toHaveBeenLastCalledWith('myToken', 'userKey', undefined);
    CampaignClassic.registerDeviceWithToken('myToken', 'userKey', {
      userId: 'test'
    });
    expect(spy).toHaveBeenLastCalledWith('myToken', 'userKey', {
      userId: 'test'
    });
  });

  it('should allow tracking notification clicked', () => {
    const spy = NativeAEPCampaignClassic.trackNotificationClickWithUserInfo;
    CampaignClassic.trackNotificationClickWithUserInfo({
      _dId: '1',
      _mId: '1'
    });
    expect(spy).toHaveBeenCalledWith({ _dId: '1', _mId: '1' });
  });

  it('should allow tracking notification received', () => {
    const spy = NativeAEPCampaignClassic.trackNotificationReceiveWithUserInfo;
    CampaignClassic.trackNotificationReceiveWithUserInfo({
      _dId: '1',
      _mId: '1'
    });
    expect(spy).toHaveBeenCalledWith({ _dId: '1', _mId: '1' });
  });
});
