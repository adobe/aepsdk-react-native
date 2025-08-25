import { useCallback } from 'react';
import { Linking, Pressable, PressableProps, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export interface ButtonProps extends Omit<PressableProps, 'onPress'> {
  actionUrl?: string;
  id?: string;
  title: string;
  onPress?: (interactId: string) => void;
  interactId?: string;
}

const Button: React.FC<ButtonProps> = ({
  actionUrl,
  id,
  title,
  onPress,
  interactId,
  ...props
}) => {
  const { theme } = useTheme();
  const handlePress = useCallback(() => {
    if (interactId) {
      onPress?.(interactId);
    }
    if (actionUrl) {
      try {
        Linking.openURL(actionUrl);
      } catch (error) {
        console.warn(`Failed to open URL: ${actionUrl}`, error);
      }
    }
  }, [actionUrl, interactId, onPress]);

  return (
    <Pressable onPress={handlePress} {...props}>
      <Text style={{ color: theme?.colors?.buttonTextColor }}>{title}</Text>
    </Pressable>
  );
};

export default Button;
