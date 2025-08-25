import {
  Image,
  ImageStyle,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { LargeImageContentData } from '../../../models/ContentCard';
import Button from '../Button/Button';
import DismissButton from '../DismissButton/DismissButton';

export interface LargeImageContentStyle {
  card?: Partial<ViewStyle>;
  container?: Partial<ViewStyle>;
  imageContainer?: Partial<ViewStyle>;
  image?: Partial<ImageStyle>;
  contentContainer?: Partial<ViewStyle>;
  textContent?: Partial<ViewStyle>;
  title?: Partial<TextStyle>;
  body?: Partial<TextStyle>;
  buttonContainer?: Partial<ViewStyle>;
}

export interface LargeImageCardProps extends PressableProps {
  content: LargeImageContentData;
  styleOverrides?: LargeImageContentStyle;
  onDismiss?: () => void;
  onPress?: () => void;
}

const LargeImageCard: React.FC<LargeImageCardProps> = ({
  content,
  styleOverrides,
  onDismiss,
  onPress,
  ...props
}) => {
  // const colorScheme = useColorScheme();

  // const imageSource = useMemo(() => {
  //   if (colorScheme === 'dark' && content?.image?.darkUrl) {
  //     return { uri: content.image.darkUrl };
  //   }
  //   return { uri: content.image?.url };
  // }, [colorScheme, content?.image?.darkUrl, content?.image?.url]);

  console.log('LargeImageCard', content);

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, styleOverrides?.card]}
      {...props}
    >
      <Image
        source={{ uri: 'https://i.ibb.co/0X8R3TG/Messages-24.png' }}
        style={{
          width: '100%',
          resizeMode: 'cover',
          aspectRatio: 1
        }}
      />
      {content?.title?.content && <Text style={[styles.title, styleOverrides?.title]}>{content.title.content}</Text>}
      {content?.body?.content && <Text style={[styles.body, styleOverrides?.body]}>{content.body.content}</Text>}
      <View style={[styles.buttonContainer, styleOverrides?.buttonContainer]}>
        {content?.buttons?.length &&
          content?.buttons?.length > 0 &&
          content.buttons.map((button) => (
            <Button
              key={button.id}
              actionUrl={button.actionUrl}
              title={button.text.content}
              onPress={onPress}
            />
          ))}
      </View>
      {content?.dismissBtn && content.dismissBtn?.style !== 'none' && (
        <DismissButton onPress={onDismiss} type={content.dismissBtn.style} />
      )}
    </Pressable>
  );
};

export default LargeImageCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    margin: 15,
    flex: 1,
    gap: 8,
    maxWidth: '100%',
  },
  container: {
    flexDirection: 'row',
    minHeight: 120
  },
  imageContainer: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    width: '35%',
    height: '100%'
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    justifyContent: 'flex-start'
  },
  textContent: {
    flex: 1,
    justifyContent: 'flex-start',
    marginBottom: 16
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginRight: 16
  },
  body: {
    fontSize: 14,
    lineHeight: 18
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: 8,
    gap: 8
  },
  button: {
    marginHorizontal: 8
  }
});
