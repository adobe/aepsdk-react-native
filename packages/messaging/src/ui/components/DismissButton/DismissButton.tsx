import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  useColorScheme
} from 'react-native';

export interface DismissButtonProps extends PressableProps {
  onPress?: () => void;
  type: 'simple' | 'circle';
}

const DismissButton = ({
  onPress,
  type,
  style,
  ...props
}: DismissButtonProps) => {
  const colorScheme = useColorScheme();

  return (
    <Pressable
      onPress={onPress}
      style={(state) => [
        styles.container,
        type === 'simple' && styles.simple,
        type === 'circle' && [
          styles.circle,
          {
            backgroundColor:
              colorScheme === 'dark'
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(0,0,0,0.1)'
          }
        ],
        state.pressed && styles.pressed,
        typeof style === 'function' ? style(state) : style
      ]}
      {...props}
    >
      <Text
        style={[
          styles.text,
          { color: colorScheme === 'dark' ? 'white' : 'black' }
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
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 18,
    minHeight: 18
  },
  pressed: {
    opacity: 0.7
  },
  simple: {
    backgroundColor: 'transparent'
  },
  circle: {
    borderRadius: 10,
    width: 18,
    height: 18
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
