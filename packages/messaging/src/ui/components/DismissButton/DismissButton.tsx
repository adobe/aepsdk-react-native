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
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  TextStyle,
  useColorScheme,
} from "react-native";

/** Props for the DismissButton component. Extends the PressableProps from react-native. */
export interface DismissButtonProps extends PressableProps {
  /** The style of the text for the dismiss button */
  textStyle?: TextStyle;
  /** The function to call when the dismiss button is pressed */
  onPress?: () => void;
  /** The style of the dismiss button */
  type: "simple" | "circle";
}

const DismissButton = ({
  onPress,
  type,
  textStyle,
  style,
  ...props
}: DismissButtonProps) => {
  const colorScheme = useColorScheme();

  return (
    <Pressable
      onPress={onPress}
      style={(state) => [
        styles.container,
        type === "simple" && styles.simple,
        type === "circle" && [
          styles.circle,
          {
            backgroundColor:
              colorScheme === "dark"
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.1)",
          },
        ],
        state.pressed && styles.pressed,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      <Text
        style={[
          styles.text,
          { color: colorScheme === "dark" ? "white" : "black" },
          textStyle,
        ]}
      >
        x
      </Text>
    </Pressable>
  );
};

export default DismissButton;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 6,
    right: 6,
    zIndex: 1000,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 18,
    minHeight: 18,
  },
  pressed: {
    opacity: 0.7,
  },
  simple: {
    backgroundColor: "transparent",
  },
  circle: {
    borderRadius: 10,
    width: 18,
    height: 18,
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});
