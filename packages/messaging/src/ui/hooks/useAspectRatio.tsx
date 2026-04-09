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
        setImageAspectRatio(height > 0 ? width / height : 1);
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
