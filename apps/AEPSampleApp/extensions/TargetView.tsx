import React from 'react';
import {Button, ScrollView, StyleSheet, Text, View} from 'react-native';
import {
  Target,
  TargetOrder,
  TargetParameters,
  TargetPrefetchObject,
  TargetProduct,
  TargetRequestObject,
} from '@adobe/react-native-aeptarget';
import {NavigationProps} from '../types/props';

function TargetView({navigation}: NavigationProps) {
  const targetExtensionVersion = () => {
    Target.extensionVersion().then(version =>
      console.log('AdobeExperienceSDK: Target version: ' + version),
    );
  };

  const clearPrefetchCache = () => {
    Target.clearPrefetchCache();
  };

  const getThirdPartyId = () => {
    Target.getThirdPartyId().then(id =>
      console.log('AdobeExperienceSDK: Third Party ID: ' + id),
    );
  };

  const getTntId = () => {
    Target.getTntId().then(id =>
      console.log('AdobeExperienceSDK: TNT ID ' + id),
    );
  };

  const resetExperience = () => {
    Target.resetExperience();
  };

  const setPreviewRestartDeeplink = () => {
    Target.setPreviewRestartDeeplink('https://www.adobe.com');
  };

  const setThirdPartyId = () => {
    Target.setThirdPartyId('thirdPartyId');
  };

  const retrieveLocationContent = () => {
    const mboxParameters1 = {status: 'platinum'};
    const mboxParameters2 = {userType: 'Paid'};
    const purchaseIDs = ['34', '125'];

    const targetOrder = new TargetOrder('ADCKKIM', 344.3, purchaseIDs);
    const targetProduct = new TargetProduct('24D3412', 'Books');
    const parameters1 = new TargetParameters(mboxParameters1, null, null, null);
    const request1 = new TargetRequestObject(
      'clickTestRyan',
      parameters1,
      'defaultContent1',
      (error, content) => {
        if (error) {
          console.error(error);
        } else {
          console.log('Adobe content:' + content);
        }
      },
    );

    const parameters2 = new TargetParameters(
      mboxParameters2,
      {profileParameters: 'parameterValue'},
      targetProduct,
      targetOrder,
    );
    const request2 = new TargetRequestObject(
      'mboxName2',
      parameters2,
      'defaultContent2',
      (error, content) => {
        if (error) {
          console.error(error);
        } else {
          console.log('Adobe content:' + content);
        }
      },
    );

    const locationRequests = [request1, request2];
    const profileParameters1 = {ageGroup: '20-32'};

    const parameters = new TargetParameters(
      {parameters: 'parametervalue'},
      profileParameters1,
      targetProduct,
      targetOrder,
    );
    Target.retrieveLocationContent(locationRequests, parameters);
  };

  const displayedLocations = () => {
    Target.displayedLocations(['clickTestRyan', 'clickTestRyan'], null);
  };

  const locationClickedWithName = () => {
    const purchaseIDs = ['34', '125'];

    const targetOrder = new TargetOrder('ADCKKIM', 344.3, purchaseIDs);
    const targetProduct = new TargetProduct('24D3412', 'Books');
    const profileParameters1 = {ageGroup: '20-32'};
    const parameters = new TargetParameters(
      {parameters: 'parametervalue'},
      profileParameters1,
      targetProduct,
      targetOrder,
    );

    Target.clickedLocation('clickTestRyan', parameters);
  };

  const prefetchContent = () => {
    const mboxParameters1 = {status: 'platinum'};
    const mboxParameters2 = {userType: 'Paid'};
    const purchaseIDs = ['34', '125'];

    const targetOrder = new TargetOrder('ADCKKIM', 344.3, purchaseIDs);
    const targetProduct = new TargetProduct('24D3412', 'Books');
    const parameters1 = new TargetParameters(mboxParameters1, null, null, null);
    const prefetch1 = new TargetPrefetchObject('clickTestRyan', parameters1);

    const parameters2 = new TargetParameters(
      mboxParameters2,
      {profileParameters: 'parameterValue'},
      targetProduct,
      targetOrder,
    );
    const prefetch2 = new TargetPrefetchObject('mboxName2', parameters2);

    const prefetchList = [prefetch1, prefetch2];
    const profileParameters1 = {ageGroup: '20-32'};

    const parameters = new TargetParameters(
      {parameters: 'parametervalue'},
      profileParameters1,
      targetProduct,
      targetOrder,
    );
    Target.prefetchContent(prefetchList, parameters)
      .then(success => console.log(success))
      .catch(err => console.log(err));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{marginTop: 75}}>
        <Button onPress={() => navigation.goBack()} title="Go to main page" />
        <Text style={styles.welcome}>Target Test App</Text>
        <Button
          title="extensionVersion()"
          onPress={() => targetExtensionVersion()}
        />
        <Button
          title="clearPrefetchCache()"
          onPress={() => clearPrefetchCache()}
        />
        <Button
          title="getThirdPartyId()"
          onPress={() => getThirdPartyId()}
        />
        <Button title="getTntId()" onPress={() => getTntId()} />
        <Button
          title="resetExperience()"
          onPress={() => resetExperience()}
        />
        <Button
          title="setPreviewRestartDeeplink(...)"
          onPress={() => setPreviewRestartDeeplink()}
        />
        <Button
          title="setThirdPartyId(...)"
          onPress={() => setThirdPartyId()}
        />
        <Button
          title="retrieveLocationContent(...)"
          onPress={() => retrieveLocationContent()}
        />
        <Button
          title="prefetchContent(...)"
          onPress={() => prefetchContent()}
        />
        <Button
          title="displayedLocations(...)"
          onPress={() => displayedLocations()}
        />
        <Button
          title="locationClickedWithName(...)"
          onPress={() => locationClickedWithName()}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 22,
    textAlign: 'center',
    margin: 10,
  },
});

export default TargetView;
