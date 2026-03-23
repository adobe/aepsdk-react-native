import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

type Props = {
  lines: string[];
  onClear?: () => void;
};

/**
 * Dedicated area for callback / async results — use testIDs for Appium.
 */
export function CallbackLogPanel({ lines, onClear }: Props) {
  const content = lines.length ? lines.join('\n') : '(no events yet)';

  return (
    <View style={styles.wrap} testID="aepsdk-callback-log-panel">
      <Text style={styles.title} testID="aepsdk-callback-log-title">
        Callback and result log
      </Text>
      <ScrollView
        style={styles.scroll}
        nestedScrollEnabled
        testID="aepsdk-callback-log-scroll">
        <Text
          selectable
          style={styles.mono}
          testID="aepsdk-callback-log-content">
          {content}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minHeight: 160,
    maxHeight: 240,
    marginVertical: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    backgroundColor: '#0d1117',
  },
  title: {
    color: '#c9d1d9',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  scroll: {
    flexGrow: 1,
  },
  mono: {
    fontFamily: 'Menlo',
    fontSize: 11,
    color: '#79c0ff',
    lineHeight: 16,
  },
});
