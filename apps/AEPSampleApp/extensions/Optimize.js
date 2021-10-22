/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.

@format
*/

import React, { useState } from 'react';
import { Button, Text, View, ScrollView, Image, WebView } from 'react-native';
import { AEPOptimize } from '@adobe/react-native-aepoptimize';
import styles from '../styles/styles';

export default ({ navigation }) => {

    const [version, setVersion] = useState('0.0.0');
    const [textOffer, setTextOffer] = useState('Text Place Holder!');

    const decisionScopes = ["eyJ4ZG06YWN0aXZpdHlJZCI6Inhjb3JlOm9mZmVyLWFjdGl2aXR5OjE0MWM4NTg2MmRiMDQ4YzkiLCJ4ZG06cGxhY2VtZW50SWQiOiJ4Y29yZTpvZmZlci1wbGFjZW1lbnQ6MTQxYzZkNWQzOGYwNDg5NyJ9"]
    const optimizeExtensionVersion = () => AEPOptimize.extensionVersion().then(newVersion => {
        console.log("AdobeExperienceSDK: AEPOptimize version: " + newVersion);
        setVersion(newVersion);
    });
    const updatePropositions = () => AEPOptimize.updatePropositions(decisionScopes, null, null);
    const getPropositions = () => AEPOptimize.getPropositions(decisionScopes).then(
        propositions => {
            console.log(`Get Proposition returned::: ${JSON.stringify(propositions)}`)
            setTextOffer(propositions[decisionScopes[0]].offers[0].content);
        });
    const clearCachedProposition = () => AEPOptimize.clearCachedPropositions();
    const onPropositionUpdate = () => AEPOptimize.onPropositionUpdate(propositions => {
        console.log(`Propositions has been update with data ${JSON.stringify(propositions)}`);        
    });

    return (<View style={styles.container}>
        <ScrollView contentContainerStyle={{ marginTop: 75 }} >
        <Button onPress={() => navigation.goBack()} title="Go to main page" />
        <Text style={styles.welcome}>Optimize</Text>
        <Button title="Extension Version" onPress={optimizeExtensionVersion}/>
        <Button title="Update Propositions" onPress={updatePropositions}/>
        <Button title="Get Propositions" onPress={getPropositions}/>
        <Button title="On Proposition Update" onPress={onPropositionUpdate}/>
        <Button title="Clear Cached Proposition" onPress={clearCachedProposition}/>
        <Text>{ version }</Text>
        <Text>{ textOffer }</Text>
        </ScrollView>
    </View>
)};