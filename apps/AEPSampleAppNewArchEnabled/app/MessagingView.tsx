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

import React from 'react';
import {Button, Text, View, ScrollView} from 'react-native';
import {MobileCore} from '@adobe/react-native-aepcore';
import {
  Messaging, 
  PersonalizationSchema, 
  MessagingEdgeEventType,
  PropositionItem  // Add this import
} from '@adobe/react-native-aepmessaging'
import styles from '../styles/styles';
import { useRouter } from 'expo-router';

const SURFACES = ['android-cbe-preview', 'cbe/json', 'android-cc'];
const SURFACES_WITH_CONTENT_CARDS = ['android-cc'];

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
    onShow: msg => console.log('show', msg),
    shouldShowMessage: () => true,
    shouldSaveMessage: () => true,
    urlLoaded: (url, message) => console.log(url, message),
  });
  console.log('messaging delegate set');
};

const getPropositionsForSurfaces = async () => {
  const messages = await Messaging.getPropositionsForSurfaces(SURFACES);
  console.log(JSON.stringify(messages));
};

const trackAction = async () => {
  MobileCore.trackAction('tuesday', {full: true});
};

const updatePropositionsForSurfaces = async () => {
  Messaging.updatePropositionsForSurfaces(SURFACES);
  console.log('Updated Propositions');
};

const getCachedMessages = async () => {
  const messages = await Messaging.getCachedMessages();
  console.log('Cached messages:', messages);
};

const getLatestMessage = async () => {
  const message = await Messaging.getLatestMessage();
  console.log('Latest Message:', message);
};

// this method can be used to track click interactions with content cards
const trackContentCardInteraction = async () => {
  const messages = await Messaging.getPropositionsForSurfaces(SURFACES_WITH_CONTENT_CARDS);
  
  for (const surface of SURFACES_WITH_CONTENT_CARDS) { 
    const propositions = messages[surface] || [];

    for (const proposition of propositions) {
      for (const propositionItem of proposition.items) {
        if (propositionItem.schema === PersonalizationSchema.CONTENT_CARD) {
          // Cast to ContentCard for the legacy tracking method
          Messaging.trackContentCardInteraction(proposition, propositionItem as any);
          console.log('trackContentCardInteraction', proposition, propositionItem);
        }
      }
    }
  }
}

// this method can be used to track display interactions with content cards
const trackContentCardDisplay = async () => {
  const messages = await Messaging.getPropositionsForSurfaces(SURFACES_WITH_CONTENT_CARDS);

  for (const surface of SURFACES_WITH_CONTENT_CARDS) { 
    const propositions = messages[surface] || [];

    for (const proposition of propositions) {
      for (const propositionItem of proposition.items) {
        if (propositionItem.schema === PersonalizationSchema.CONTENT_CARD) {
          // Cast to ContentCard for the legacy tracking method
          Messaging.trackContentCardDisplay(proposition, propositionItem as any);
          console.log('trackContentCardDisplay', proposition, propositionItem);
        }
      }
    }
  }
}

// New method demonstrating trackPropositionItem API
const trackPropositionItemExample = async () => {
  const messages = await Messaging.getPropositionsForSurfaces(SURFACES);
  
  for (const surface of SURFACES) { 
    const propositions = messages[surface] || [];

    for (const proposition of propositions) {
      for (const propositionItem of proposition.items) {
        // Track proposition item interaction using the new API
        Messaging.trackPropositionItem(
          propositionItem.id, 
          'button_clicked', 
          MessagingEdgeEventType.INTERACT, 
          null
        );
        console.log('trackPropositionItem called for:', propositionItem.id);
      }
    }
  }
}

// New method demonstrating generatePropositionInteractionXdm API
// const generatePropositionInteractionXdmExample = async () => {
//   const messages = await Messaging.getPropositionsForSurfaces(SURFACES);
  
//   for (const surface of SURFACES) { 
//     const propositions = messages[surface] || [];

//     for (const proposition of propositions) {
//       for (const propositionItem of proposition.items) {
//         // Generate XDM data for proposition item interaction
//         try {
//           const xdmData = await Messaging.generatePropositionInteractionXdm(
//             propositionItem.id, 
//             'link_clicked', 
//             MessagingEdgeEventType.INTERACT, 
//             ['token1', 'token2']
//           );
//           console.log('Generated XDM data:', JSON.stringify(xdmData));
//         } catch (error) {
//           console.error('Error generating XDM data:', error);
//         }
//       }
//     }
//   }
// }

// Method demonstrating unified tracking using PropositionItem methods
const unifiedTrackingExample = async () => {
  const messages = await Messaging.getPropositionsForSurfaces(SURFACES);
  console.log('messages here are ', messages);
  
  for (const surface of SURFACES) { 
    const propositions = messages[surface] || [];

    for (const proposition of propositions) {
      for (const propositionItemData of proposition.items) {
        // Create PropositionItem instance from the plain data object
        const propositionItem = new PropositionItem(propositionItemData);
        console.log('propositionItem here is created:', propositionItem);
        
        // Use the unified tracking approach via PropositionItem
        if (propositionItem.schema === PersonalizationSchema.CONTENT_CARD) {
          // Track display for content cards
          propositionItem.track(MessagingEdgeEventType.DISPLAY);
          console.log('Tracked content card display using unified API');
          
          // Track interaction with custom interaction string
          propositionItem.track('card_clicked', MessagingEdgeEventType.INTERACT, null);
          console.log('Tracked content card interaction using unified API');
        } else if (propositionItem.schema === PersonalizationSchema.JSON_CONTENT) {
          // Track display for JSON content
          propositionItem.track(MessagingEdgeEventType.DISPLAY);
          console.log('Tracked JSON content display using unified API');
        }
      }
    }
  }
}

// // Method demonstrating unified XDM generation using PropositionItem methods
// const unifiedXdmGenerationExample = async () => {
//   const messages = await Messaging.getPropositionsForSurfaces(SURFACES);
  
//   for (const surface of SURFACES) { 
//     const propositions = messages[surface] || [];

//     for (const proposition of propositions) {
//       for (const propositionItem of proposition.items) {
//         try {
//           // Generate XDM using the unified approach - check if the method exists
//           if ('generateInteractionXdm' in propositionItem) {
//             const xdmData = await propositionItem.generateInteractionXdm(
//               'unified_interaction', 
//               MessagingEdgeEventType.INTERACT, 
//               ['unified_token']
//             );
//             console.log('Generated XDM using unified API:', JSON.stringify(xdmData));
//           } else {
//             // Fall back to the static method for items that don't have the instance method
//             const xdmData = await Messaging.generatePropositionInteractionXdm(
//               propositionItem.id,
//               'unified_interaction', 
//               MessagingEdgeEventType.INTERACT, 
//               ['unified_token']
//             );
//             console.log('Generated XDM using static API fallback:', JSON.stringify(xdmData));
//           }
//         } catch (error) {
//           console.error('Error generating XDM with unified API:', error);
//         }
//       }
//     }
//   }
// }

function MessagingView() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{marginTop: 75}}>
        <Button onPress={router.back} title="Go to main page" />
        <Text style={styles.welcome}>Messaging</Text>
        <Button title="extensionVersion()" onPress={messagingExtensionVersion} />
        <Button title="refreshInAppMessages()" onPress={refreshInAppMessages} />
        <Button title="setMessagingDelegate()" onPress={setMessagingDelegate} />
        <Button
          title="getPropositionsForSurfaces()"
          onPress={getPropositionsForSurfaces}
        />
        <Button
          title="updatePropositionsForSurfaces()"
          onPress={updatePropositionsForSurfaces}
        />
        <Button title="getCachedMessages()" onPress={getCachedMessages} />
        <Button title="getLatestMessage()" onPress={getLatestMessage} />
        <Button title="trackAction()" onPress={trackAction} />
        <Button title="trackPropositionInteraction()" onPress={trackContentCardInteraction} />
        <Button title="trackContentCardDisplay()" onPress={trackContentCardDisplay} />
        <Button title="trackPropositionItem()" onPress={trackPropositionItemExample} />
        {/* <Button title="generatePropositionInteractionXdm()" onPress={generatePropositionInteractionXdmExample} /> */}
        <Button title="Unified Tracking Example" onPress={unifiedTrackingExample} />
        {/* <Button title="Unified XDM Generation Example" onPress={unifiedXdmGenerationExample} /> */}
      </ScrollView>
    </View>
  );
}

export default MessagingView;
