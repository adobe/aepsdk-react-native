/*
    Copyright 2026 Adobe. All rights reserved.
    This file is licensed to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law
    or agreed to in writing, software distributed under the License is
    distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS OF
    ANY KIND, either express or implied. See the License for the specific
    language governing permissions and limitations under the License.
*/

import {
  Image,
  ImageProps,
  ImageStyle,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
  ViewProps,
  ViewStyle
} from "react-native";
import useAspectRatio from "../../hooks/useAspectRatio";
import { useTheme } from "../../theme";
import FullScreenCenterView from "../FullScreenCenterView/FullScreenCenterView";

interface EmptyStateProps extends ViewProps {
  image: string;
  text: string;
  styleOverrides?: {
    container?: ViewStyle;
    image?: ImageStyle;
    text?: TextStyle;
  };
  InboxProps?: Partial<ViewProps>;
  ImageProps?: Partial<ImageProps>;
  TextProps?: Partial<TextProps>;
}

/**
 * @experimental First React Native inbox UI — subject to change while we expand testing.
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  image,  
  text,
  styleOverrides,
  InboxProps,
  ImageProps,
  TextProps
}) => {
  const { colors } = useTheme();
  const ratio = useAspectRatio(image);

  return (
    <FullScreenCenterView 
      style={[styles.container, styleOverrides?.container]} 
      {...InboxProps}
    >
      {image && <Image
        source={{ uri: image }}
        style={[styles.image, { aspectRatio: ratio }, styleOverrides?.image]}
        resizeMode="contain"
        {...ImageProps}
      />}
      <Text 
        style={[styles.text, { color: colors.textPrimary }, styleOverrides?.text]} 
        {...TextProps}
      >
        {text}
      </Text>
    </FullScreenCenterView>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  image: {
    width: '50%'
  },
  text: {
    fontWeight: '600',
    fontSize: 16
  },
  container: {
    gap: 16
  }
});