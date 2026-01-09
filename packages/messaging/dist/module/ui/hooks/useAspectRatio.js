"use strict";

import { useEffect, useState } from 'react';
import { Image } from 'react-native';
function useAspectRatio(uri) {
  const [imageAspectRatio, setImageAspectRatio] = useState(1);
  useEffect(() => {
    if (!uri) {
      return;
    }
    Image.getSize(uri, (width, height) => {
      setImageAspectRatio(width / height);
    }, error => {
      console.log('Error getting image size:', error);
      setImageAspectRatio(1);
    });
  }, [uri]);
  return imageAspectRatio;
}
export default useAspectRatio;
//# sourceMappingURL=useAspectRatio.js.map