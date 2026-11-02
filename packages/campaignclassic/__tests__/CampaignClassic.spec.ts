jest.mock('../src/NativeAEPCampaignClassic', () => ({
  __esModule: true,
  default: {
    extensionVersion: jest.fn().mockResolvedValue('1.0.0'),
    registerDeviceWithToken: jest.fn(),
    trackNotificationClickWithUserInfo: jest.fn(),
    trackNotificationReceiveWithUserInfo: jest.fn(),
    handleRemoteMessage: jest.fn().mockResolvedValue(true)
  }
}));

import NativeAEPCampaignClassic from '../src/NativeAEPCampaignClassic';
import { CampaignClassic } from '../src';

describe('Campaign Classic', () => {
  it('should return extension version', async () => {
    const spy = jest.spyOn(NativeAEPCampaignClassic, 'extensionVersion');
    const version = await CampaignClassic.extensionVersion();
    expect(spy).toHaveBeenCalled();
    expect(version).toMatch('1.0.0');
  });

  it('should register devices passed', () => {
    const spy = jest.spyOn(NativeAEPCampaignClassic, 'registerDeviceWithToken');
    CampaignClassic.registerDeviceWithToken('myToken', 'userKey');
    expect(spy).toHaveBeenCalled();
    CampaignClassic.registerDeviceWithToken('myToken', 'userKey', {
      userId: 'test'
    });
    expect(spy).toHaveBeenCalled();
  });

  it('should allow tracking notification clicked', () => {
    const spy = jest.spyOn(NativeAEPCampaignClassic, 'trackNotificationClickWithUserInfo');
    CampaignClassic.trackNotificationClickWithUserInfo({
      _dId: '1',
      _mId: '1'
    });
    expect(spy).toHaveBeenCalledWith({ _dId: '1', _mId: '1' });
  });

  it('should allow tracking notification received', () => {
    const spy = jest.spyOn(NativeAEPCampaignClassic, 'trackNotificationReceiveWithUserInfo');
    CampaignClassic.trackNotificationReceiveWithUserInfo({
      _dId: '1',
      _mId: '1'
    });
    expect(spy).toHaveBeenCalledWith({ _dId: '1', _mId: '1' });
  });

  it('should forward the FCM data payload and return the native result', async () => {
    const spy = jest.spyOn(NativeAEPCampaignClassic, 'handleRemoteMessage');
    const handled = await CampaignClassic.handleRemoteMessage({
      _dId: '1',
      _mId: '1'
    });
    expect(spy).toHaveBeenCalledWith({ _dId: '1', _mId: '1' });
    expect(handled).toBe(true);
  });
});
