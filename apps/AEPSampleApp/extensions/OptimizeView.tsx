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

import React, {useMemo, useState} from 'react';
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
  useWindowDimensions,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';

const ViewTypes = {
  header: 0,
  content: 1,
};

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

function SmokeButton({
  id,
  title,
  onPress,
}: {
  id: string;
  title: string;
  onPress: () => void;
}) {
  return (
    <View style={{margin: 5}}>
      <Button testID={id} accessibilityLabel={id} title={title} onPress={onPress} />
    </View>
  );
}

export default ({navigation}: any) => {
  const [version, setVersion] = useState('0.0.0');
  const [customScopeInput, setCustomScopeInput] = useState('demoLoc3');
  const [textProposition, setTextProposition] = useState<Proposition>();
  const [imageProposition, setImageProposition] = useState<Proposition>();
  const [htmlProposition, setHtmlProposition] = useState<Proposition>();
  const [jsonProposition, setJsonProposition] = useState<Proposition>();
  const [targetProposition, setTargetProposition] = useState<Proposition | undefined>();
  const [listKey, setListKey] = useState(0);

  const dataProvider = useMemo(
    () =>
      new DataProvider((data1, data2) => {
        return data1 !== data2;
      }),
    [],
  );

  const { width } = useWindowDimensions();

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
  const decisionScopeTargetMbox = new DecisionScope(customScopeInput.trim() || 'demoLoc3');

  const decisionScopes = [
    decisionScopeText,
    decisionScopeImage,
    decisionScopeHtml,
    decisionScopeJson,
    decisionScopeTargetMbox,
  ];

  const optimizeExtensionVersion = async () => {
    const version = await Optimize.extensionVersion();
    console.log('AdobeExperienceSDK: Optimize version: ' + version);
    setVersion(version);
  };

  const updatePropositions = () => {
    Optimize.updatePropositions(decisionScopes);
    console.log('Updated Propositions');
  };

  const updatePropositionsWithCallback = () => {
    Optimize.updatePropositions(
      decisionScopes,
      undefined,
      undefined,
      (response: Map<string, Proposition>) => {
        console.log('updatePropositions onSuccess:', response);
      },
      (error: any) => {
        console.log('updatePropositions onError:', error);
      },
    );
  };

  const displayTargetOffer = () => {
    if (targetProposition?.items?.[0]) {
      targetProposition.items[0].displayed(targetProposition);
      console.log('Display Target Offer invoked');
    } else {
      console.log('No target proposition cached — run Get Propositions first');
    }
  };

  const tapTargetOffer = () => {
    if (targetProposition?.items?.[0]) {
      targetProposition.items[0].tapped(targetProposition);
      console.log('Offer is tapped');
    } else {
      console.log('No target proposition cached — run Get Propositions first');
    }
  };

  const multipleOffersDisplayed = () => {
    const allOffers: any[] = [];
    for (const prop of [textProposition, imageProposition, htmlProposition, jsonProposition, targetProposition]) {
      if (prop?.items) {
        for (const offer of prop.items) {
          allOffers.push(offer);
        }
      }
    }
    Optimize.displayed(allOffers);
    console.log('Multiple Offers Displayed with ' + allOffers.length + ' offers');
  };

  const multipleOffersGenerateDisplayInteractionXdm = async () => {
    const allOffers: any[] = [];
    for (const prop of [textProposition, imageProposition, htmlProposition, jsonProposition, targetProposition]) {
      if (prop?.items) {
        for (const offer of prop.items) {
          allOffers.push(offer);
        }
      }
    }
    try {
      const xdm = await Optimize.generateDisplayInteractionXdm(allOffers);
      console.log('generateDisplayInteractionXdm:', JSON.stringify(xdm));
    } catch (e) {
      console.log('generateDisplayInteractionXdm error:', e);
    }
  };

  const getPropositions = async () => {
    const propositions: Map<string, Proposition> =
      await Optimize.getPropositions(decisionScopes);
    console.log(propositions);
    if (propositions) {
      setTextProposition(propositions.get(decisionScopeText.getName()));
      setImageProposition(propositions.get(decisionScopeImage.getName()));
      setHtmlProposition(propositions.get(decisionScopeHtml.getName()));
      setJsonProposition(propositions.get(decisionScopeJson.getName()));
      setTargetProposition(propositions.get(decisionScopeTargetMbox.getName()));
    }
  };

  const clearCachedProposition = () => {
    Optimize.clearCachedPropositions();
    console.log('Proposition cache cleared');
  };

  const onPropositionUpdate = () =>
    Optimize.onPropositionUpdate({
      call(propositions: Map<String, Proposition>) {
        if (!propositions) {
          return;
        }

        // Defer state updates — RecyclerListView crashes if mutated during layout (RN 0.85/Fabric).
        requestAnimationFrame(() => {
          const target = propositions.get(decisionScopeTargetMbox.getName());
          if (target) {
            setTargetProposition(target);
          }
          const text = propositions.get(decisionScopeText.getName());
          if (text) {
            setTextProposition(text);
          }
          const image = propositions.get(decisionScopeImage.getName());
          if (image) {
            setImageProposition(image);
          }
          const html = propositions.get(decisionScopeHtml.getName());
          if (html) {
            setHtmlProposition(html);
          }
          const json = propositions.get(decisionScopeJson.getName());
          if (json) {
            setJsonProposition(json);
          }
          setListKey((k) => k + 1);
        });
      },
    });

  const renderTargetOffer = () => {
    if (targetProposition?.items) {
      if (targetProposition.items[0].format === TARGET_OFFER_TYPE_JSON) {
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

  const inputStyles = StyleSheet.create({
    label: {fontWeight: '600', marginTop: 8, marginBottom: 2, color: '#333', alignSelf: 'flex-start'},
    input: {borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, fontSize: 13, marginBottom: 2, backgroundColor: '#fff', width: width - 32},
    hint: {fontSize: 11, color: '#666', marginBottom: 4, alignSelf: 'flex-start'},
    divider: {height: 1, backgroundColor: '#ddd', marginVertical: 8, width: width - 32},
  });

  const layoutProvider = useMemo(
    () =>
      new LayoutProvider(
        index => {
          if (index % 2 === 0) {
            return ViewTypes.header;
          }
          return ViewTypes.content;
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
      ),
    [width],
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
    <ScrollView
      style={{flex: 1, backgroundColor: '#F5FCFF'}}
      contentContainerStyle={{alignItems: 'center', paddingBottom: 24, marginTop: 30}}>
      <Button onPress={() => navigation.goBack()} title="Go to main page" />
      <Text style={styles.welcome}>Optimize</Text>

      <Text style={inputStyles.label}>Decision Scope (Target Mbox)</Text>
      <TextInput
        style={inputStyles.input}
        value={customScopeInput}
        onChangeText={setCustomScopeInput}
        placeholder="e.g. demoLoc3"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Text style={inputStyles.hint}>Active scope: {customScopeInput.trim() || 'demoLoc3'}</Text>
      <View style={inputStyles.divider} />

      <SmokeButton
        id="smoke-extension-version"
        title="Extension Version"
        onPress={optimizeExtensionVersion}
      />
      <SmokeButton
        id="smoke-subscribe-proposition-update"
        title="Subscribe to Proposition Update"
        onPress={onPropositionUpdate}
      />
      <SmokeButton
        id="smoke-update-propositions"
        title="Update Propositions"
        onPress={updatePropositions}
      />
      <SmokeButton
        id="smoke-update-propositions-callback"
        title="Update Propositions (Callback)"
        onPress={updatePropositionsWithCallback}
      />
      <SmokeButton
        id="smoke-get-propositions"
        title="Get Propositions"
        onPress={getPropositions}
      />
      <SmokeButton
        id="smoke-display-target-offer"
        title="Display Target Offer"
        onPress={displayTargetOffer}
      />
      <SmokeButton
        id="smoke-tap-target-offer"
        title="Tap Target Offer"
        onPress={tapTargetOffer}
      />
      <SmokeButton
        id="smoke-clear-cached-proposition"
        title="Clear Cached Proposition"
        onPress={clearCachedProposition}
      />
      <SmokeButton
        id="smoke-multiple-offers-displayed"
        title="Multiple Offers Displayed"
        onPress={multipleOffersDisplayed}
      />
      <View style={{margin: 5}}>
        <Button title="Multiple Offers Generate Display Interaction XDM" onPress={multipleOffersGenerateDisplayInteractionXdm} />
      </View>
      <Text style={{...styles.welcome, fontSize: 20}}>
        SDK Version:: {version}
      </Text>
      <Text style={styles.welcome}>Personalized Offers</Text>
      {width > 0 ? (
        <View style={{width, height: 300}}>
          <RecyclerListView
            key={listKey}
            style={{flex: 1}}
            layoutProvider={layoutProvider}
            dataProvider={getContent()}
            rowRenderer={rowRenderer}
            onVisibleIndicesChanged={indicesChangeHandler}
          />
        </View>
      ) : null}
    </ScrollView>
  );
};
