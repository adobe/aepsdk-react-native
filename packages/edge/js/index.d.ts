/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.

*/
export class Edge{
    static extensionVersion(): Promise<string>;
    static sendEvent(experienceEvent: ExperienceEvent): Promise<Array<EdgeEventHandle>>;
}

export class EdgeEventHandle{
    type: string;
    payload: Map;

 constructor(type?: string, payload?: Map)
}

export class ExperienceEvent{
    xdmData: Map;
    data: Map;
    datasetIdentifier: string;

  constructor(xdmData: Map, data?: Map, datasetIdentifier?: string)
}