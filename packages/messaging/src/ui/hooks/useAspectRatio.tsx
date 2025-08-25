import { useEffect, useState } from 'react';
import { Image } from 'react-native';

function useAspectRatio(uri?: string) {
  const [imageAspectRatio, setImageAspectRatio] = useState<number>(1);

  useEffect(() => {
    if (!uri) {
      return;
    }

    Image.getSize(
      uri,
      (width, height) => {
        setImageAspectRatio(width / height);
      },
      (error) => {
        console.log('Error getting image size:', error);
        setImageAspectRatio(1);
      }
    );
  }, [uri]);

  return imageAspectRatio;
}

export default useAspectRatio;
