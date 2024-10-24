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

import TargetOrder from './TargetOrder';
import TargetProduct from './TargetProduct';

class TargetParameters {
  parameters?: { [key: string]: string };
  profileParameters?: { [key: string]: string };
  order?: TargetOrder;
  product?: TargetProduct;

  constructor(
    parameters?: { [key: string]: string },
    profileParameters?: { [key: string]: string },
    product?: TargetProduct,
    order?: TargetOrder
  ) {
    this.parameters = parameters;
    this.profileParameters = profileParameters;
    this.product = product;
    this.order = order;
  }
}

export default TargetParameters;
