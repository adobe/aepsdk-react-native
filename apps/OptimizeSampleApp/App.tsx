/**
 * Optimize Sample App - Simple AEP Core extension version
 */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { MobileCore, LogLevel, getExtensionVersion, getOptimizeVersion } from '@adobe/react-native-aepcore';

const APP_ID = 'YOUR-APP-ID'; // Replace with your Adobe Mobile Services App ID

function App() {
  const [coreVersion, setCoreVersion] = useState<string | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    MobileCore.setLogLevel(LogLevel.DEBUG);
    MobileCore.initializeWithAppId(APP_ID)
      .then(() => {
        console.log('AEP SDK initialized');
        return MobileCore.extensionVersion();
      })
      .then((version) => {
        setCoreVersion(version);
        setReady(true);
      })
      .catch((error) => {
        console.error('AEP SDK init error:', error);
        setInitError(error?.message ?? 'Initialization failed');
        setReady(true);
      });
  }, []);
const getoptimizeVersion = async () => {
  const version = await getOptimizeVersion();
  console.log('Optimize version turbo module:', version);
};
  const getCoreVersion = async () => {
    const version = await getExtensionVersion();
    console.log('Core version turbo module:', version);
  };

  if (!ready) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.label}>Initializing AEP SDK...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Optimize Sample App</Text>
      <Text style={styles.subtitle}>
        AEP Core – MobileCore.extensionVersion
      </Text>
      {initError ? (
        <View style={styles.card}>
          <Text style={styles.errorLabel}>Error</Text>
          <Text style={styles.errorText}>{initError}</Text>
          <Text style={styles.hint}>
            Set APP_ID in App.tsx to your Adobe Mobile Services App ID.
          </Text>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.label}>Core extension version</Text>
          <Text style={styles.version}>{coreVersion ?? '—'}</Text>
          <Pressable style={styles.button} onPress={getoptimizeVersion}>
            <Text style={styles.buttonText}>Log optimize  version</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    minWidth: 280,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  version: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  button: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#007aff',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  errorLabel: {
    fontSize: 14,
    color: '#c00',
    marginBottom: 8,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  hint: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
});

export default App;
