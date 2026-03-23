/**
 * AwesomeProject — Adobe AEP sample shell (Core + Assurance + Optimize).
 *
 * @format
 */
import React, { useEffect, useState } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { LogLevel, MobileCore } from '@adobe/react-native-aepcore';
import { Assurance } from '@adobe/react-native-aepassurance';
import { CallbackLogPanel } from './src/components/CallbackLogPanel';
import { LAUNCH_APP_ID } from './src/constants';
import { useCallbackLog } from './src/hooks/useCallbackLog';
import { OptimizeExperienceScreen } from './src/screens/OptimizeExperienceScreen';

function App() {
  return (
    <SafeAreaProvider>
      <AppBody />
    </SafeAreaProvider>
  );
}

function AppBody() {
  const insets = useSafeAreaInsets();
  const { lines, appendLog, clearLog } = useCallbackLog();
  const [assuranceUrl, setAssuranceUrl] = useState('');
  const [sdkInitStatus, setSdkInitStatus] = useState<
    'pending' | 'ready' | 'error'
  >('pending');

  useEffect(() => {
    MobileCore.setLogLevel(LogLevel.DEBUG);
    appendLog(`MobileCore.setLogLevel(DEBUG); initialize appId=${LAUNCH_APP_ID}`);
    MobileCore.initializeWithAppId(LAUNCH_APP_ID)
      .then(() => {
        appendLog('MobileCore.initializeWithAppId: success');
        setSdkInitStatus('ready');
      })
      .catch((error: unknown) => {
        appendLog(`MobileCore.initializeWithAppId error: ${String(error)}`);
        setSdkInitStatus('error');
      });
  }, [appendLog]);

  const onCoreExtensionVersion = async () => {
    try {
      const v = await MobileCore.extensionVersion();
      appendLog(`MobileCore.extensionVersion() => ${v}`);
    } catch (e) {
      appendLog(`MobileCore.extensionVersion error: ${String(e)}`);
    }
  };

  const onAssuranceExtensionVersion = async () => {
    try {
      const v = await Assurance.extensionVersion();
      appendLog(`Assurance.extensionVersion() => ${v}`);
    } catch (e) {
      appendLog(`Assurance.extensionVersion error: ${String(e)}`);
    }
  };

  const onAssuranceStartSession = () => {
    const url = assuranceUrl.trim();
    if (!url) {
      appendLog('Assurance.startSession: empty URL (paste an Assurance session link)');
      return;
    }
    try {
      Assurance.startSession(url);
      appendLog(`Assurance.startSession("${url}")`);
    } catch (e) {
      appendLog(`Assurance.startSession error: ${String(e)}`);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safe, { paddingTop: insets.top }]}
      testID="aepsdk-app-root">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        testID="aepsdk-app-scroll">
        <Text style={styles.title} testID="aepsdk-app-title">
          AEP AwesomeProject
        </Text>
        <Text testID="aepsdk-sdk-init-status">
          SDK init: {sdkInitStatus} (appId: {LAUNCH_APP_ID})
        </Text>

        <Text style={styles.section}>Core</Text>
        <View style={styles.row}>
          <Button
            title="Core extension version"
            onPress={onCoreExtensionVersion}
            testID="aepsdk-core-btn-extension-version"
          />
        </View>

        <Text style={styles.section}>Assurance</Text>
        <View style={styles.row}>
          <Button
            title="Assurance extension version"
            onPress={onAssuranceExtensionVersion}
            testID="aepsdk-assurance-btn-extension-version"
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Assurance session URL"
          placeholderTextColor="#888"
          autoCapitalize="none"
          autoCorrect={false}
          value={assuranceUrl}
          onChangeText={setAssuranceUrl}
          testID="aepsdk-assurance-url-input"
        />
        <View style={styles.row}>
          <Button
            title="Start Assurance session"
            onPress={onAssuranceStartSession}
            testID="aepsdk-assurance-btn-start-session"
          />
        </View>

        <View style={styles.logHeaderRow}>
          <Text style={styles.section}>Event log</Text>
          <Button title="Clear log" onPress={clearLog} testID="aepsdk-btn-clear-log" />
        </View>
        <CallbackLogPanel lines={lines} />

        <Text style={styles.section}>Optimize</Text>
        <OptimizeExperienceScreen appendLog={appendLog} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  scrollContent: {
    paddingBottom: 48,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  section: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  row: {
    marginVertical: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
    backgroundColor: '#fff',
  },
  logHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});

export default App;
