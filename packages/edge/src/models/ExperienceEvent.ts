/*
 Copyright 2022 Adobe. All rights reserved.
 This file is licensed to you under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License. You may obtain a copy
 of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under
 the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 OF ANY KIND, either express or implied. See the License for the specific language
 governing permissions and limitations under the License.
 */

const XDM_DATA = 'xdmData';
const DATA = 'data';
const DATASET_IDENTIFIER = 'datasetIdentifier';
const DATASTREAM_ID_OVERRIDE = 'datastreamIdOverride';
const DATASTREAM_CONFIG_OVERRIDE = 'datastreamConfigOverride';

type ExperienceEventArguments =
  | {
      xdmData?: Record<string, any>;
      data?: Record<string, any> | null;
      datasetIdentifier?: string | null;
    }
  | {
      xdmData?: Record<string, any>;
      data?: Record<string, any> | null;
      datastreamIdOverride?: string | null;
      datastreamConfigOverride?: Record<string, any> | null;
    };

class ExperienceEvent {
  xdmData?: Record<string, any> | null;
  data?: Record<string, any> | null;
  datasetIdentifier?: string | null;
  datastreamIdOverride?: string | null;
  datastreamConfigOverride?: Record<string, any> | null;

  constructor(args: ExperienceEventArguments);
  // preserve backwards compatibility with the old constructor
  // ExperienceEvent(xdmData, data, datasetIdentifier);
  constructor(xdmData?: Record<string, any>, data?: Record<string, any> | null, datasetIdentifier?: string | null);
  // setup the constructor to handle datastreamIdOverride and datastreamConfigOverride
  // ExperienceEvent(xdmData: xdmData, data: data, datasetIdentifier: datasetIdentifier);
  // ExperienceEvent(xdmData: xdmData, data: data, datastreamIdOverride: datastreamIdOverride);
  // ExperienceEvent(xdmData: xdmData, data: data, datastreamConfigOverride: datastreamConfigOverride);
  constructor(
    argsOrXdmData?: ExperienceEventArguments | Record<string, any>,
    data?: Record<string, any> | null,
    datasetIdentifier?: string | null,
  ) {
    if (typeof argsOrXdmData === 'object' && 'xdmData' in argsOrXdmData) {
      const args = argsOrXdmData as ExperienceEventArguments;
      this.xdmData = args[XDM_DATA];
      this.data = args[DATA];
      this.datasetIdentifier = DATASET_IDENTIFIER in args ? args[DATASET_IDENTIFIER] : undefined;
      this.datastreamIdOverride = DATASTREAM_ID_OVERRIDE in args ? args[DATASTREAM_ID_OVERRIDE] : undefined;
      this.datastreamConfigOverride = DATASTREAM_CONFIG_OVERRIDE in args ? args[DATASTREAM_CONFIG_OVERRIDE ] : undefined;
    } else {
      this.xdmData = argsOrXdmData as Record<string, any>;
      this.data = data;
      this.datasetIdentifier = datasetIdentifier;
    }
  }
}

export default ExperienceEvent;
  