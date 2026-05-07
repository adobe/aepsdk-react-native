/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React, {useState} from 'react';
import {Button, Text, View, ScrollView, TextInput, StyleSheet, Switch} from 'react-native';
import {MobileCore} from '@adobe/react-native-aepcore';
import {
  Messaging,
  PersonalizationSchema,
  MessagingEdgeEventType
} from '@adobe/react-native-aepmessaging';
import {NavigationProps} from '../types/props';

const parseSurfaces = (input: string): string[] =>
  input.split(',').map(s => s.trim()).filter(Boolean);

function ParamBadge({label}: {label: string}) {
  return (
    <Text style={styles.badge}>{label}</Text>
  );
}

function MessagingView({navigation}: NavigationProps) {
  const [surfacesInput, setSurfacesInput] = useState('cbehtml-ios,android-cc');
  const [contentCardSurfacesInput, setContentCardSurfacesInput] = useState('android-cc');
  const [trackActionName, setTrackActionName] = useState('iamjs');
  const [trackActionFull, setTrackActionFull] = useState(true);

  const surfaces = parseSurfaces(surfacesInput);
  const contentCardSurfaces = parseSurfaces(contentCardSurfacesInput);

  const messagingExtensionVersion = async () => {
    const version = await Messaging.extensionVersion();
    console.log(`AdobeExperienceSDK: Messaging version: ${version}`);
  };

  const refreshInAppMessages = () => {
    Messaging.refreshInAppMessages();
    console.log('messages refreshed');
  };

  const setMessagingDelegate = () => {
    Messaging.setMessagingDelegate({
      onDismiss: msg => console.log('dismissed!', msg),
      onShow: msg => {
        console.log('show', msg);
        msg.handleJavascriptMessage('myInappCallback', (content: string) => {
          console.log('Received webview content in onShow:', content);
        });
      },
      shouldShowMessage: () => true,
      shouldSaveMessage: () => true,
      urlLoaded: (url, message) => console.log(url, message)
    });
    console.log('messaging delegate set');
  };

  const getPropositionsForSurfaces = async () => {
    const messages = await Messaging.getPropositionsForSurfaces(surfaces);
    console.log('getPropositionsForSurfaces', JSON.stringify(messages));
  };

  const updatePropositionsForSurfaces = async () => {
    Messaging.updatePropositionsForSurfaces(surfaces);
    console.log('Updated Propositions for:', surfaces);
  };

  const getCachedMessages = async () => {
    const messages = await Messaging.getCachedMessages();
    console.log('Cached messages:', messages);
  };

  const getLatestMessage = async () => {
    const message = await Messaging.getLatestMessage();
    console.log('Latest Message:', message);
  };

  const trackAction = async () => {
    MobileCore.trackAction(trackActionName, {full: trackActionFull});
    console.log('trackAction:', trackActionName, 'full:', trackActionFull);
  };

  const trackContentCardInteraction = async () => {
    const messages = await Messaging.getPropositionsForSurfaces(contentCardSurfaces);
    for (const surface of contentCardSurfaces) {
      const propositions = messages[surface] || [];
      for (const proposition of propositions) {
        for (const propositionItem of proposition.items) {
          if (propositionItem.schema === PersonalizationSchema.CONTENT_CARD) {
            Messaging.trackContentCardInteraction(proposition, propositionItem as any);
            console.log('trackContentCardInteraction', proposition, propositionItem);
          }
        }
      }
    }
  };

  const trackContentCardDisplay = async () => {
    const messages = await Messaging.getPropositionsForSurfaces(contentCardSurfaces);
    for (const surface of contentCardSurfaces) {
      const propositions = messages[surface] || [];
      for (const proposition of propositions) {
        for (const propositionItem of proposition.items) {
          if (propositionItem.schema === PersonalizationSchema.CONTENT_CARD) {
            Messaging.trackContentCardDisplay(proposition, propositionItem as any);
            console.log('trackContentCardDisplay', proposition, propositionItem);
          }
        }
      }
    }
  };

  const unifiedTrackingExample = async () => {
    const messages = await Messaging.getPropositionsForSurfaces(surfaces);
    for (const surface of surfaces) {
      const propositions = messages[surface] || [];
      for (const proposition of propositions) {
        for (const propositionItem of proposition.items) {
          propositionItem.track(MessagingEdgeEventType.DISPLAY);
          propositionItem.track('content_card_clicked', MessagingEdgeEventType.INTERACT, null);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{padding: 16, marginTop: 30}}>
        <Button onPress={() => navigation.goBack()} title="Go to main page" />
        <Text style={styles.welcome}>Messaging</Text>

        {/* ── Surfaces ── */}
        <Text style={styles.sectionTitle}>🔷 Surfaces</Text>
        <Text style={styles.label}>Surfaces (comma-separated)</Text>
        <TextInput
          style={styles.input}
          value={surfacesInput}
          onChangeText={setSurfacesInput}
          placeholder="e.g. cbehtml-ios,android-cc"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text style={styles.hint}>Active: {surfaces.join(', ')}</Text>
        <Text style={styles.usedBy}>Used by: getPropositionsForSurfaces · updatePropositionsForSurfaces · Unified Tracking</Text>

        {/* ── Content Card Surfaces ── */}
        <Text style={styles.sectionTitle}>🔶 Content Card Surfaces</Text>
        <Text style={styles.label}>Content Card Surfaces (comma-separated)</Text>
        <TextInput
          style={styles.input}
          value={contentCardSurfacesInput}
          onChangeText={setContentCardSurfacesInput}
          placeholder="e.g. android-cc"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text style={styles.hint}>Active: {contentCardSurfaces.join(', ')}</Text>
        <Text style={styles.usedBy}>Used by: trackContentCardInteraction · trackContentCardDisplay</Text>

        {/* ── Track Action ── */}
        <Text style={styles.sectionTitle}>🔘 Track Action</Text>
        <Text style={styles.label}>Action Name</Text>
        <TextInput
          style={styles.input}
          value={trackActionName}
          onChangeText={setTrackActionName}
          placeholder="e.g. iamjs"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <View style={styles.row}>
          <Text style={styles.label}>full</Text>
          <Switch value={trackActionFull} onValueChange={setTrackActionFull} />
          <Text style={styles.hint}>{trackActionFull ? 'true' : 'false'}</Text>
        </View>
        <Text style={styles.usedBy}>Used by: trackAction</Text>

        <View style={styles.divider} />

        {/* ── No params ── */}
        <Text style={styles.groupLabel}>No parameters</Text>
        <Button title="extensionVersion()" onPress={messagingExtensionVersion} />
        <Button title="refreshInAppMessages()" onPress={refreshInAppMessages} />
        <Button title="setMessagingDelegate()" onPress={setMessagingDelegate} />
        <Button title="getCachedMessages()" onPress={getCachedMessages} />
        <Button title="getLatestMessage()" onPress={getLatestMessage} />

        <View style={styles.divider} />

        {/* ── Uses Surfaces ── */}
        <Text style={styles.groupLabel}>Uses Surfaces <ParamBadge label="🔷 surfaces" /></Text>
        <Button title="getPropositionsForSurfaces()" onPress={getPropositionsForSurfaces} />
        <Button title="updatePropositionsForSurfaces()" onPress={updatePropositionsForSurfaces} />
        <Button title="Unified Tracking Example" onPress={unifiedTrackingExample} />

        <View style={styles.divider} />

        {/* ── Uses Content Card Surfaces ── */}
        <Text style={styles.groupLabel}>Uses Content Card Surfaces <ParamBadge label="🔶 cc surfaces" /></Text>
        <Button title="trackPropositionInteraction()" onPress={trackContentCardInteraction} />
        <Button title="trackContentCardDisplay()" onPress={trackContentCardDisplay} />

        <View style={styles.divider} />

        {/* ── Uses Track Action params ── */}
        <Text style={styles.groupLabel}>Uses Track Action <ParamBadge label="🔘 action + full" /></Text>
        <View style={styles.buttonWrapper}>
          <Button title="trackAction()" onPress={trackAction} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5FCFF'},
  welcome: {fontSize: 22, textAlign: 'center', margin: 10},
  sectionTitle: {fontSize: 15, fontWeight: '700', marginTop: 16, marginBottom: 4, color: '#333'},
  groupLabel: {fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 4},
  label: {fontWeight: '600', marginBottom: 2, color: '#333'},
  hint: {fontSize: 11, color: '#666', marginBottom: 2},
  usedBy: {fontSize: 11, color: '#888', fontStyle: 'italic', marginBottom: 6},
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 6,
    padding: 8, fontSize: 13, marginBottom: 2, backgroundColor: '#fff',
  },
  row: {flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2},
  divider: {height: 1, backgroundColor: '#ddd', marginVertical: 12},
  buttonWrapper: {marginVertical: 4},
  badge: {
    fontSize: 11, color: '#555', backgroundColor: '#e8e8e8',
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden',
  },
});

export default MessagingView;
