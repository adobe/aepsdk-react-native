/*
    Copyright 2025 Adobe. All rights reserved.
    This file is licensed to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law
    or agreed to in writing, software distributed under the License is
    distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS OF
    ANY KIND, either express or implied. See the License for the specific
    language governing permissions and limitations under the License.
*/
import React, { useCallback } from 'react';
import {
  AccessibilityRole,
  GestureResponderEvent,
  Linking,
  Pressable,
  PressableProps,
  StyleProp,
  Text,
  TextStyle
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export interface ButtonProps extends Omit<PressableProps, 'onPress'> {
  actionUrl?: string;
  id?: string;
  title: string;
  onPress?: (interactId?: string, event?: GestureResponderEvent) => void;
  interactId?: string;
  textStyle?: StyleProp<TextStyle>;
  accessibilityRole?: AccessibilityRole;
}

const Button: React.FC<ButtonProps> = ({
  actionUrl,
  title,
  onPress,
  interactId,
  textStyle,
  style,
  accessibilityRole = 'button',
  ...props
}) => {
  const { colors } = useTheme();
  const handlePress = useCallback(async (event: GestureResponderEvent) => {
    onPress?.(interactId, event);
    if (actionUrl) {
      try {
        const supported = await Linking.canOpenURL(actionUrl);
        if (supported) {
          await Linking.openURL(actionUrl);
        } else {
          console.warn(`Cannot open URL: ${actionUrl}`);
        }
      } catch (error) {
        console.warn(`Failed to open URL: ${actionUrl}`, error);
      }
    }
  }, [actionUrl, interactId, onPress]);

  return (
    <Pressable  
      accessibilityRole={accessibilityRole} 
      onPress={handlePress} 
      style={style} 
      {...props}
    >
      <Text style={[{ color: colors?.buttonTextColor }, textStyle]}>
        {title}
      </Text>
    </Pressable>
  );
};

export default Button;
