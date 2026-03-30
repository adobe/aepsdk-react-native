/**
 * Optimize API exercise screen (adapted from AEPSampleAppNewArchEnabled OptimizeView).
 * Uses FlatList only (no recyclerlistview). List has scrollEnabled={false}; parent ScrollView scrolls.
 */
import React, { useCallback, useState } from 'react';
import {
  Button,
  Dimensions,
  FlatList,
  Image,
  ListRenderItem,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Optimize,
  DecisionScope,
  Proposition,
  Offer,
} from '@adobe/react-native-aepoptimize';
import { WebView } from 'react-native-webview';
import styles from '../../styles/styles';

type ContentSlot = 'text' | 'image' | 'json' | 'html' | 'target';

type ListRow =
  | { id: string; rowType: 'header'; label: string }
  | { id: string; rowType: 'content'; slot: ContentSlot };

const LIST_ROWS: ListRow[] = [
  { id: 'h-text', rowType: 'header', label: 'Text Offer' },
  { id: 'c-text', rowType: 'content', slot: 'text' },
  { id: 'h-img', rowType: 'header', label: 'Image Offer' },
  { id: 'c-img', rowType: 'content', slot: 'image' },
  { id: 'h-json', rowType: 'header', label: 'JSON Offer' },
  { id: 'c-json', rowType: 'content', slot: 'json' },
  { id: 'h-html', rowType: 'header', label: 'HTML Offer' },
  { id: 'c-html', rowType: 'content', slot: 'html' },
  { id: 'h-target', rowType: 'header', label: 'Target Mbox Offer' },
  { id: 'c-target', rowType: 'content', slot: 'target' },
];

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

type Props = {
  appendLog: (message: string) => void;
};

export function OptimizeExperienceScreen({ appendLog }: Props) {
  const [version, setVersion] = useState('0.0.0');
  const [textProposition, setTextProposition] = useState<Proposition>();
  const [imageProposition, setImageProposition] = useState<Proposition>();
  const [htmlProposition, setHtmlProposition] = useState<Proposition>();
  const [jsonProposition, setJsonProposition] = useState<Proposition>();
  const [targetProposition, setTargetProposition] = useState<
    Proposition | undefined
  >();

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
  const decisionScopeTargetMbox = new DecisionScope('mboxAug');

  const decisionScopes = [
    // decisionScopeText,
    // decisionScopeImage,
    // decisionScopeHtml,
    // decisionScopeJson,
    decisionScopeTargetMbox,
  ];

  const { width } = Dimensions.get('window');

  const optimizeExtensionVersion = async () => {
    try {
      const v = await Optimize.extensionVersion();
      appendLog(`Optimize.extensionVersion() => ${v}`);
      setVersion(v);
    } catch (e) {
      appendLog(`Optimize.extensionVersion error: ${String(e)}`);
    }
  };

  const updatePropositions = () => {
    appendLog('Optimize.updatePropositions() invoked');
    Optimize.updatePropositions(decisionScopes);
  };

  const testUpdatePropositionsCallback = () => {
    appendLog('Optimize.updatePropositions(..., onSuccess, onError) invoked');
    Optimize.updatePropositions(
      decisionScopes,
      undefined,
      undefined,
      (response) => {
        let payload = '';
        try {
          payload = JSON.stringify(
            Object.fromEntries(response),
            null,
            2,
          ).slice(0, 4000);
        } catch {
          payload = '[could not stringify response]';
        }
        appendLog(`updatePropositions onSuccess: ${payload}`);
      },
      (error) => {
        appendLog(`updatePropositions onError: ${String(error)}`);
      },
    );
  };

  const getPropositions = async () => {
    try {
      const propositions = await Optimize.getPropositions(decisionScopes);
      appendLog(`getPropositions: size=${propositions.size}`);
      if (propositions) {
        setTextProposition(propositions.get(decisionScopeText.getName()));
        setImageProposition(propositions.get(decisionScopeImage.getName()));
        setHtmlProposition(propositions.get(decisionScopeHtml.getName()));
        setJsonProposition(propositions.get(decisionScopeJson.getName()));
        setTargetProposition(
          propositions.get(decisionScopeTargetMbox.getName()),
        );
        try {
          appendLog(
            `getPropositions payload (truncated): ${JSON.stringify(
              Object.fromEntries(propositions),
              null,
              2,
            ).slice(0, 4000)}`,
          );
        } catch {
          appendLog('getPropositions: could not stringify propositions');
        }
      }
    } catch (e) {
      appendLog(`getPropositions error: ${String(e)}`);
    }
  };

  const clearCachedProposition = () => {
    Optimize.clearCachedPropositions();
    appendLog('Optimize.clearCachedPropositions()');
  };

  const onPropositionUpdate = () => {
    Optimize.onPropositionUpdate({
      call(propositions: Map<string, Proposition>) {
        appendLog(
          `onPropositionUpdate callback: keys=${JSON.stringify([
            ...propositions.keys(),
          ])}`,
        );
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
    appendLog('Optimize.onPropositionUpdate() registered');
  };

  const multipleOffersDisplayed = async () => {
    try {
      const propositionsMap = await Optimize.getPropositions(decisionScopes);
      const offers: Offer[] = [];
      propositionsMap.forEach((proposition: Proposition) => {
        if (proposition?.items?.length) {
          proposition.items.forEach((offer) => offers.push(offer));
        }
      });
      appendLog(`Optimize.displayed() with ${offers.length} offer(s)`);
      Optimize.displayed(offers);
    } catch (e) {
      appendLog(`multipleOffersDisplayed error: ${String(e)}`);
    }
  };

  const multipleOffersGenerateDisplayInteractionXdm = async () => {
    try {
      const propositionsMap = await Optimize.getPropositions(decisionScopes);
      const offers: Offer[] = [];
      propositionsMap.forEach((proposition: Proposition) => {
        if (proposition?.items?.length) {
          proposition.items.forEach((offer) => offers.push(offer));
        }
      });
      const displayInteractionXdm =
        await Optimize.generateDisplayInteractionXdm(offers);
      const serialized = displayInteractionXdm
        ? JSON.stringify(
            Object.fromEntries(displayInteractionXdm),
            null,
            2,
          ).slice(0, 8000)
        : 'null';
      appendLog(`generateDisplayInteractionXdm: ${serialized}`);
    } catch (e) {
      appendLog(`generateDisplayInteractionXdm error: ${String(e)}`);
    }
  };

  const renderTargetOffer = () => {
    if (targetProposition?.items) {
      if (targetProposition.items[0].format === TARGET_OFFER_TYPE_JSON) {
        return (
          <Text
            style={{ margin: 10, fontSize: 18 }}
            onPress={() => {
              targetProposition?.items[0].tapped(targetProposition);
            }}>
            {targetProposition.items[0].content}
          </Text>
        );
      }
      if (targetProposition.items[0].format === TARGET_OFFER_TYPE_HTML) {
        return (
          <TouchableOpacity
            onPress={() => {
              targetProposition?.items[0].tapped(targetProposition);
            }}>
            <View style={{ width, height: 150 }}>
              <WebView
                textZoom={100}
                originWhitelist={['*']}
                source={{ html: targetProposition.items[0].content }}
              />
            </View>
          </TouchableOpacity>
        );
      }
    }
    return <Text>Default Target Offer</Text>;
  };

  const renderContent = useCallback(
    (slot: ContentSlot) => {
      if (slot === 'text') {
        return (
          <View style={{ minHeight: 120 }}>
            <Text
              style={{ margin: 10, fontSize: 18 }}
              onPress={() => {
                textProposition?.items[0].tapped(textProposition);
              }}>
              {textProposition?.items[0]
                ? textProposition.items[0].content
                : defaultPropositions.textProposition}
            </Text>
          </View>
        );
      }
      if (slot === 'image') {
        return (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              minHeight: 120,
            }}>
            <TouchableOpacity
              onPress={() => {
                imageProposition?.items[0].tapped(imageProposition);
              }}>
              <Image
                style={{ width: 100, height: 100, margin: 10 }}
                source={{
                  uri: imageProposition?.items[0]
                    ? imageProposition.items[0].content
                    : defaultPropositions.imageProposition,
                }}
              />
            </TouchableOpacity>
          </View>
        );
      }
      if (slot === 'json') {
        return (
          <View style={{ minHeight: 120 }}>
            <Text
              style={{ margin: 10, fontSize: 18 }}
              onPress={() => {
                jsonProposition?.items[0].tapped(jsonProposition);
              }}>
              {jsonProposition?.items?.[0]
                ? jsonProposition.items[0].content
                : defaultPropositions.jsonProposition}
            </Text>
          </View>
        );
      }
      if (slot === 'html') {
        return (
          <View style={{ minHeight: 160 }}>
            <TouchableOpacity
              onPress={() => {
                htmlProposition?.items[0].tapped(htmlProposition);
              }}>
              <View style={{ width, height: 150 }}>
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
          </View>
        );
      }
      if (slot === 'target') {
        return <View style={{ minHeight: 120 }}>{renderTargetOffer()}</View>;
      }
      return null;
    },
    [
      width,
      textProposition,
      imageProposition,
      jsonProposition,
      htmlProposition,
      targetProposition,
    ],
  );

  const renderItem: ListRenderItem<ListRow> = useCallback(
    ({ item }) => {
      if (item.rowType === 'header') {
        return (
          <View>
            <Text style={styles.header}>{item.label}</Text>
          </View>
        );
      }
      return renderContent(item.slot);
    },
    [renderContent],
  );

  const keyExtractor = useCallback((item: ListRow) => item.id, []);

  return (
    <View testID="aepsdk-optimize-screen">
      <Text style={styles.welcome} testID="aepsdk-optimize-heading">
        Optimize
      </Text>

      <View style={{ margin: 5 }}>
        <Button
          title="Extension Version"
          onPress={optimizeExtensionVersion}
          testID="aepsdk-optimize-btn-extension-version"
        />
      </View>
      <View style={{ margin: 5 }}>
        <Button
          title="Update Propositions"
          onPress={updatePropositions}
          testID="aepsdk-optimize-btn-update-propositions"
        />
      </View>
      <View style={{ margin: 5 }}>
        <Button
          title="Test Update Propositions Callback"
          onPress={testUpdatePropositionsCallback}
          testID="aepsdk-optimize-btn-update-propositions-callback"
        />
      </View>
      <View style={{ margin: 5 }}>
        <Button
          title="Get Propositions"
          onPress={getPropositions}
          testID="aepsdk-optimize-btn-get-propositions"
        />
      </View>
      <View style={{ margin: 5 }}>
        <Button
          title="Clear Cached Proposition"
          onPress={clearCachedProposition}
          testID="aepsdk-optimize-btn-clear-cache"
        />
      </View>
      <View style={{ margin: 5 }}>
        <Button
          title="Subscribe to Proposition Update"
          onPress={onPropositionUpdate}
          testID="aepsdk-optimize-btn-proposition-update"
        />
      </View>
      <View style={{ margin: 5 }}>
        <Button
          title="Multiple Offers Displayed"
          onPress={multipleOffersDisplayed}
          testID="aepsdk-optimize-btn-multiple-displayed"
        />
      </View>
      <View style={{ margin: 5 }}>
        <Button
          title="Multiple Offers Generate Display Interaction XDM"
          onPress={multipleOffersGenerateDisplayInteractionXdm}
          testID="aepsdk-optimize-btn-generate-display-xdm"
        />
      </View>

      <Text
        style={{ ...styles.welcome, fontSize: 20 }}
        testID="aepsdk-optimize-sdk-version-text">
        SDK Version: {version}
      </Text>
      <Text style={styles.welcome}>Personalized Offers</Text>

      <FlatList
        data={LIST_ROWS}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        scrollEnabled={false}
        nestedScrollEnabled
        removeClippedSubviews={false}
        testID="aepsdk-optimize-offers-list"
      />
    </View>
  );
}
