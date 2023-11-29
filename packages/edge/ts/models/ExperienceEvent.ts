/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

class ExperienceEvent {
  xdmData?: Record<string, any>;
  data?: Record<string, any>;
  datasetIdentifier?: string;
  datastreamIdOverride?: string;
  datastreamConfigOverride?: Record<string, any>;

  // Constructor overloads with parameter xdmData, data, datasetIdentifier
  constructor(xdmData?: Record<string, any>, data?: Record<string, any> | null, datasetIdentifier?: string | null);

  // Constructor overloads with parameter xdmData, datastreamIdOverride, datastreamConfigOverride
  constructor(xdmData?: Record<string, any>, dataStreamIdOverride?: string | null, datastreamConfigOverride?: Record<string, any> | null);

  constructor(xdmData?: Record<string, any>,
    arg2?: Record<string, any> | string | null | undefined,
    arg3?: string | Record<string, any> | null | undefined) {
    this.xdmData = xdmData;

    // Check if arg2 is set to null
    if (arg2 === null) {
      // Check if arg3 is a string, set to datasetIdentifier
      if (typeof arg3 === 'string') {
        this.datasetIdentifier = arg3;
      }
      // Check if arg3 is an object, set to datastreamConfigOverride
      else if (arg3 instanceof Object) {
        this.datastreamConfigOverride = arg3;
      }
      // Log unsupported case
      else {
        console.log('Unsupported ExperienceEvent parameters');
      }
    }
    // Check if arg2 is an object and arg3 is a string, set to data and datasetIdentifier
    else if (arg2 instanceof Object && typeof arg3 === 'string') {
      this.data = arg2;
      this.datasetIdentifier = arg3;
    }
    // Check if arg2 is a string and arg3 is an object, set to datastreamIdOverride and datastreamConfigOverride
    else if (typeof arg2 === 'string' && arg3 instanceof Object) {
      this.datastreamIdOverride = arg2;
      this.datastreamConfigOverride = arg3;
    }
     // Check if arg2 is an object, set to data
     else if (arg2 instanceof Object) {
      this.data = arg2;
    }
    // Check if arg2 is a string, set to datastreamIdOverride
    else if (typeof arg2 === 'string') {
    this.datastreamIdOverride = arg2;
    }
    // Log unsupported case
    else {
      console.log('Unsupported ExperienceEvent parameters');
    }
  }
}

export default ExperienceEvent;
