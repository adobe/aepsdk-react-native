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

import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
} from "react-native";
import { Assurance } from "@adobe/react-native-aepassurance";
import { useRouter } from "expo-router";

const AssuranceView = () => {
  const [version, setVersion] = useState("");
  const [sessionURL, setsessionURL] = useState("your-assurance-url");

  const router = useRouter();

  Assurance.extensionVersion().then((version) => {
    setVersion(version);
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ marginTop: 75 }}>
        <Button onPress={router.back} title="Go to main page" />
        <Text style={styles.welcome}>Assurance v{version}</Text>
        <Button title="Start Session" onPress={startSessionClicked} />
        <TextInput
          style={{ height: 40, margin: 10 }}
          placeholder="assurance://"
          onChangeText={(val) => setsessionURL(val)}
        />
      </ScrollView>
    </View>
  );

  function startSessionClicked() {
    Assurance.startSession(sessionURL);
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  welcome: {
    fontSize: 25,
    textAlign: "center",
    margin: 10,
    marginTop: 80,
  },
});

export default AssuranceView;
