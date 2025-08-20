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

/**
 * AEPOptimizeError interface representing the error structure returned by 
 * both iOS and Android native SDK implementations.
 */
export interface AEPOptimizeError {
    /** The type of error that occurred */
    type?: string;
    
    /** The HTTP status code of the error */
    status?: number;
    
    /** The title of the error */
    title?: string;
    
    /** The details of the error */
    detail?: string;
    
    /** Additional error report information */
    report?: { [key: string]: any };
    
    /** The corresponding AEP/Adobe error type */
    aepError?: string;
  }
  
  export default AEPOptimizeError; 