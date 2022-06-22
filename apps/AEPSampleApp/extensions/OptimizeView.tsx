/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React, {useState} from 'react';
import {
  Optimize,
  DecisionScope,
  Proposition,
} from '@adobe/react-native-aepoptimize';
import {WebView} from 'react-native-webview';
import styles from '../styles/styles';
import {
  Button,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';

const ViewTypes = {
  header: 0,
  content: 1,
};

const TARGET_OFFER_TYPE_TEXT = 'text/plain';
const TARGET_OFFER_TYPE_JSON = 'application/json';
const TARGET_OFFER_TYPE_HTML = 'text/html';

const defaultPropositions = {
  textProposition: 'Placeholder Text Offer!!',
  imageProposition:
    'https://blog.adobe.com/en/publish/2020/05/28/media_3dfaf748ad02bf771410a771def79c9ad86b1766.jpg',
  htmlProposition:
    '<html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><p>HTML place holder!</p></body></html>',
  jsonProposition: '{"Type": "JSON place holder"}',
};

export default ({navigation}: any) => {
  const [version, setVersion] = useState('0.0.0');
  const [textProposition, setTextProposition] = useState<Proposition>(null);
  const [imageProposition, setImageProposition] = useState<Proposition>(null);
  const [htmlProposition, setHtmlProposition] = useState<Proposition>();
  const [jsonProposition, setJsonProposition] = useState<Proposition>(null);
  const [targetProposition, setTargetProposition] = useState<Proposition>(null);

  const decisionScopeText = new DecisionScope(
    'eyJ4ZG06YWN0aXZpdHlJZCI6Inhjb3JlOm9mZmVyLWFjdGl2aXR5OjE0MWM4NTg2MmRiMDQ4YzkiLCJ4ZG06cGxhY2VtZW50SWQiOiJ4Y29yZTpvZmZlci1wbGFjZW1lbnQ6MTQxYzZkNWQzOGYwNDg5NyJ9',
  );
  const decisionScopeImage = new DecisionScope(
    'eyJ4ZG06YWN0aXZpdHlJZCI6Inhjb3JlOm9mZmVyLWFjdGl2aXR5OjE0MWM4NTg2MmRiMDQ4YzkiLCJ4ZG06cGxhY2VtZW50SWQiOiJ4Y29yZTpvZmZlci1wbGFjZW1lbnQ6MTQxYzZkYTliNDMwNDg5OCJ9',
  );
  const decisionScopeHtml = new DecisionScope(
    'eyJ4ZG06YWN0aXZpdHlJZCI6Inhjb3JlOm9mZmVyLWFjdGl2aXR5OjE0MWM4NTg2MmRiMDQ4YzkiLCJ4ZG06cGxhY2VtZW50SWQiOiJ4Y29yZTpvZmZlci1wbGFjZW1lbnQ6MTQxYzZkOTJjNmJhZDA4NCJ9',
  );
  const decisionScopeJson = new DecisionScope(
    'eyJ4ZG06YWN0aXZpdHlJZCI6Inhjb3JlOm9mZmVyLWFjdGl2aXR5OjE0MWM4NTg2MmRiMDQ4YzkiLCJ4ZG06cGxhY2VtZW50SWQiOiJ4Y29yZTpvZmZlci1wbGFjZW1lbnQ6MTQxYzZkN2VjOTZmOTg2ZCJ9',
  );
  const decisionScopeTargetMbox = new DecisionScope('demoLoc3');

  const decisionScopes = [
    decisionScopeText,
    decisionScopeImage,
    decisionScopeHtml,
    decisionScopeJson,
    decisionScopeTargetMbox,
  ];
  const optimizeExtensionVersion = () =>
    Optimize.extensionVersion().then(newVersion => {
      console.log('AdobeExperienceSDK: Optimize version: ' + newVersion);
      setVersion(newVersion);
    });
  const updatePropositions = () =>
    Optimize.updatePropositions(decisionScopes, null, null);
  const getPropositions = () =>
    Optimize.getPropositions(decisionScopes).then(
      (propositions: Map<string, Proposition>) => {
        if (propositions) {
          setTextProposition(propositions.get(decisionScopeText.getName()));
          setImageProposition(propositions.get(decisionScopeImage.getName()));
          setHtmlProposition(propositions.get(decisionScopeHtml.getName()));
          setJsonProposition(propositions.get(decisionScopeJson.getName()));
          setTargetProposition(
            propositions.get(decisionScopeTargetMbox.getName()),
          );
        }
      },
    );
  const clearCachedProposition = () => Optimize.clearCachedPropositions();
  const onPropositionUpdate = () =>
    Optimize.onPropositionUpdate({
      call(propositions: Map<String, Proposition>) {
        if (propositions) {
          setTextProposition(propositions.get(decisionScopeText.getName()));
          setImageProposition(propositions.get(decisionScopeImage.getName()));
          setHtmlProposition(propositions.get(decisionScopeHtml.getName()));
          setJsonProposition(propositions.get(decisionScopeJson.getName()));
          setTargetProposition(
            propositions.get(decisionScopeTargetMbox.getName()),
          );
        }
      },
    });

  const renderTargetOffer = () => {
    if (targetProposition?.items) {
      if (targetProposition.items[0].format === TARGET_OFFER_TYPE_TEXT) {
        return (
          <Text
            style={{margin: 10, fontSize: 18}}
            onPress={() => {
              targetProposition?.items[0].tapped(targetProposition);
            }}>
            {targetProposition.items[0].content}
          </Text>
        );
      } else if (targetProposition.items[0].format === TARGET_OFFER_TYPE_JSON) {
        return (
          <Text
            style={{margin: 10, fontSize: 18}}
            onPress={() => {
              targetProposition?.items[0].tapped(targetProposition);
            }}>
            {targetProposition.items[0].content}
          </Text>
        );
      } else if (targetProposition.items[0].format === TARGET_OFFER_TYPE_HTML) {
        return (
          <TouchableOpacity
            onPress={e => {
              targetProposition?.items[0].tapped(targetProposition);
            }}>
            <View style={{width: width, height: 150}}>
              <WebView
                textZoom={100}
                originWhitelist={['*']}
                source={{html: targetProposition.items[0].content}}
              />
            </View>
          </TouchableOpacity>
        );
      }
    }
    return <Text>Default Target Offer</Text>;
  };

  let dataProvider = new DataProvider((data1, data2) => {
    return data1 !== data2;
  });

  var {width} = Dimensions.get('window');

  let layoutProvider = new LayoutProvider(
    index => {
      if (index % 2 === 0) {
        //View type is for header
        return ViewTypes.header;
      } else {
        //View type is for Content
        return ViewTypes.content;
      }
    },
    (type, dimen) => {
      switch (type) {
        case ViewTypes.header:
          dimen.width = width;
          dimen.height = 50;
          break;

        case ViewTypes.content:
          dimen.width = width;
          dimen.height = 200;
          break;

        default:
          dimen.width = 0;
          dimen.height = 0;
          break;
      }
    },
  );

  let rowRenderer = (type: any, data: any) => {
    switch (type) {
      case ViewTypes.header:
        return (
          <View>
            <Text style={styles.header}>{data}</Text>
          </View>
        );

      case ViewTypes.content:
        if (data === textProposition) {
          return (
            <View>
              <Text
                style={{margin: 10, fontSize: 18}}
                onPress={e => {
                  textProposition?.items[0].tapped(textProposition);
                }}>
                {textProposition?.items[0]
                  ? textProposition.items[0].content
                  : defaultPropositions.textProposition}
              </Text>
            </View>
          );
        } else if (data === imageProposition) {
          return (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                onPress={e => {
                  imageProposition?.items[0].tapped(imageProposition);
                }}>
                <Image
                  style={{width: 100, height: 100, margin: 10}}
                  source={{
                    uri: imageProposition?.items[0]
                      ? imageProposition.items[0].content
                      : defaultPropositions.htmlProposition,
                  }}></Image>
              </TouchableOpacity>
            </View>
          );
        } else if (data === jsonProposition) {
          return (
            <Text
              style={{margin: 10, fontSize: 18}}
              onPress={e => {
                jsonProposition?.items[0].tapped(jsonProposition);
              }}>
              {' '}
              {jsonProposition?.items?.[0]
                ? jsonProposition.items[0].content
                : defaultPropositions.jsonProposition}
            </Text>
          );
        } else if (data === htmlProposition) {
          return (
            <TouchableOpacity
              onPress={() => {
                htmlProposition?.items[0].tapped(htmlProposition);
              }}>
              <View style={{width: width, height: 150}}>
                <WebView
                  textZoom={100}
                  originWhitelist={['*']}
                  source={{
                    html: htmlProposition?.items?.[0]
                      ? htmlProposition.items[0].content
                      : defaultPropositions.htmlProposition,
                  }}
                />
              </View>
            </TouchableOpacity>
          );
        } else if (data === targetProposition) {
          return renderTargetOffer();
        }
        return (
          <View>
            <Text style={styles.text}>Offer type didn't match</Text>
          </View>
        );
      default:
        return null;
    }
  };

  var data: any;
  let getContent = () => {
    data = new Array();
    data.push('Text Offer');
    data.push(textProposition);
    data.push('Image Offer');
    data.push(imageProposition);
    data.push('JSON Offer');
    data.push(jsonProposition);
    data.push('HTML Offer');
    data.push(htmlProposition);
    data.push('Target Mbox Offer');
    data.push(targetProposition);
    return dataProvider.cloneWithRows(data);
  };

  let hasBegunScrolling = true;
  let indicesWithData = [1, 3, 5, 7, 9];

  let indicesChangeHandler = (all: any, now: any, notNow: any) => {
    if (hasBegunScrolling && notNow && notNow[0] && notNow[0] === 0) {
      for (const i in all) {
        if (
          indicesWithData.includes(i as any) &&
          typeof data[i] === 'object' &&
          data[i].items
        ) {
          const offer = data[i].items[0];
          const proposition = data[i];
          offer.displayed(proposition);
        }
      }
      hasBegunScrolling = false;
    } else if (
      now &&
      indicesWithData.includes(now[0]) &&
      data[now[0]] &&
      typeof data[now[0]] === 'object' &&
      data[now[0]].items
    ) {
      const offer = data[now[0]].items[0];
      const proposition = data[now[0]];
      offer.displayed(proposition);
    }
  };

  return (
    <View style={{...styles.container, marginTop: 30}}>
      <Button onPress={() => navigation.goBack()} title="Go to main page" />
      <Text style={styles.welcome}>Optimize</Text>
      <View style={{margin: 5}}>
        <Button title="Extension Version" onPress={optimizeExtensionVersion} />
      </View>
      <View style={{margin: 5}}>
        <Button title="Update Propositions" onPress={updatePropositions} />
      </View>
      <View style={{margin: 5}}>
        <Button title="Get Propositions" onPress={getPropositions} />
      </View>
      <View style={{margin: 5}}>
        <Button
          title="Clear Cached Proposition"
          onPress={clearCachedProposition}
        />
      </View>
      <View style={{margin: 5}}>
        <Button
          title="Subscribe to Proposition Update"
          onPress={onPropositionUpdate}
        />
      </View>
      <Text style={{...styles.welcome, fontSize: 20}}>
        SDK Version:: {version}
      </Text>
      <Text style={styles.welcome}>Personalized Offers</Text>
      <RecyclerListView
        style={{width: width}}
        layoutProvider={layoutProvider}
        dataProvider={getContent()}
        rowRenderer={rowRenderer}
        onVisibleIndicesChanged={indicesChangeHandler}
      />
    </View>
  );
};
