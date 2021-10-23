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
import { Button, Text, View, ScrollView, Image } from 'react-native';
// import { WebView } from 'react-native-webview';
import { AEPOptimize } from '@adobe/react-native-aepoptimize';
import styles from '../styles/styles';

export default ({ navigation }) => {

    const [version, setVersion] = useState('0.0.0');
    const [textOffer, setTextOffer] = useState('Text Place Holder!');
    const [imageuri, setImageuri] = useState('');
    const [html, setHtml] = useState('');
    const [jsontext, setJsontext] = useState('');

    const decisionScopeText = "eyJ4ZG06YWN0aXZpdHlJZCI6Inhjb3JlOm9mZmVyLWFjdGl2aXR5OjE0MWM4NTg2MmRiMDQ4YzkiLCJ4ZG06cGxhY2VtZW50SWQiOiJ4Y29yZTpvZmZlci1wbGFjZW1lbnQ6MTQxYzZkNWQzOGYwNDg5NyJ9"
    const decisionScopeImage = "eyJ4ZG06YWN0aXZpdHlJZCI6Inhjb3JlOm9mZmVyLWFjdGl2aXR5OjE0MWM4NTg2MmRiMDQ4YzkiLCJ4ZG06cGxhY2VtZW50SWQiOiJ4Y29yZTpvZmZlci1wbGFjZW1lbnQ6MTQxYzZkYTliNDMwNDg5OCJ9"
    const decisionScopeHtml = "eyJ4ZG06YWN0aXZpdHlJZCI6Inhjb3JlOm9mZmVyLWFjdGl2aXR5OjE0MWM4NTg2MmRiMDQ4YzkiLCJ4ZG06cGxhY2VtZW50SWQiOiJ4Y29yZTpvZmZlci1wbGFjZW1lbnQ6MTQxYzZkOTJjNmJhZDA4NCJ9"
    const decisionScopeJson = "eyJ4ZG06YWN0aXZpdHlJZCI6Inhjb3JlOm9mZmVyLWFjdGl2aXR5OjE0MWM4NTg2MmRiMDQ4YzkiLCJ4ZG06cGxhY2VtZW50SWQiOiJ4Y29yZTpvZmZlci1wbGFjZW1lbnQ6MTQxYzZkN2VjOTZmOTg2ZCJ9"

    const decisionScopes = [ decisionScopeText, decisionScopeImage, decisionScopeHtml, decisionScopeJson ]
    const optimizeExtensionVersion = () => AEPOptimize.extensionVersion().then(newVersion => {
        console.log("AdobeExperienceSDK: AEPOptimize version: " + newVersion);
        setVersion(newVersion);
    });
    const updatePropositions = () => AEPOptimize.updatePropositions(decisionScopes, null, null);
    const getPropositions = () => AEPOptimize.getPropositions(decisionScopes).then(
        propositions => {
            console.log(`Get Proposition returned::: ${JSON.stringify(propositions)}`)
            setTextOffer(propositions[decisionScopeText].offers[0].content);
            setImageuri(propositions[decisionScopeImage].offers[0].content);
            setHtml(propositions[decisionScopeHtml].offers[0].content);
            setJsontext(JSON.stringify(propositions[decisionScopeJson].offers[0].content));
            console.log(`-------- ${propositions[decisionScopeJson].offers[0].content}`);
        });
    const clearCachedProposition = () => AEPOptimize.clearCachedPropositions();
    const onPropositionUpdate = () => AEPOptimize.onPropositionUpdate(propositions => {
        console.log(`Propositions has been update with data ${JSON.stringify(propositions)}`);        
        setTextOffer(propositions[decisionScopeText].offers[0].content);
        setImageuri(propositions[decisionScopeImage].offers[0].content);
        setHtml(propositions[decisionScopeHtml].offers[0].content);
        setJsontext(JSON.stringify(propositions[decisionScopeJson].offers[0].content));
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
        <Text>SDK Version:: { version }</Text>
        <Text>Text Offer:: { textOffer }</Text>
        <Image style={{width:50, height:50}} source={{uri: imageuri}}></Image>
        {/* <WebView source={{ html: html }}></WebView> */}
        <Text>JSON Offer:: { jsontext }</Text>
        </ScrollView>
    </View>
)};