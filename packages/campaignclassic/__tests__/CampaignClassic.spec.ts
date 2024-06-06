import { NativeModules } from 'react-native';
import { CampaignClassic } from '../src';

describe('Campaign Classic', () => {
  it('should return extension version', async () => {
    const spy = jest.spyOn(
      NativeModules.AEPCampaignClassic,
      'extensionVersion'
    );
    const version = await CampaignClassic.extensionVersion();
    expect(spy).toHaveBeenCalled();
    expect(version).toMatch('1.0.0');
  });

  it('should register devices passed', () => {
    const spy = jest.spyOn(
      NativeModules.AEPCampaignClassic,
      'registerDeviceWithToken'
    );
    CampaignClassic.registerDeviceWithToken('myToken', 'userKey');
    expect(spy).toHaveBeenCalled();
    CampaignClassic.registerDeviceWithToken('myToken', 'userKey', {
      userId: 'test'
    });
    expect(spy).toHaveBeenCalled();
  });

  it('should allow tracking notification clicked', () => {
    const spy = jest.spyOn(
      NativeModules.AEPCampaignClassic,
      'trackNotificationClickWithUserInfo'
    );
    CampaignClassic.trackNotificationClickWithUserInfo({
      _dId: '1',
      _mId: '1'
    });
    expect(spy).toHaveBeenCalledWith({ _dId: '1', _mId: '1' });
  });

  it('should allow tracking notification received', () => {
    const spy = jest.spyOn(
      NativeModules.AEPCampaignClassic,
      'trackNotificationReceiveWithUserInfo'
    );
    CampaignClassic.trackNotificationReceiveWithUserInfo({
      _dId: '1',
      _mId: '1'
    });
    expect(spy).toHaveBeenCalledWith({ _dId: '1', _mId: '1' });
  });
});
