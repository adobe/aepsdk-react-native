/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { NativeModules } from 'react-native';
import MessagingEdgeEventType from '../src/models/MessagingEdgeEventType';
import { PersonalizationSchema } from '../src/models/PersonalizationSchema';
import { PropositionItem, PropositionItemData } from '../src/models/PropositionItem';

describe('PropositionItem', () => {
  const uuid = 'activity-uuid-123';
  const id = 'item-abc';
  const activityID = uuid; // mirrors native mapping

  const baseData: PropositionItemData = {
    id,
    uuid,
    activityID,
    schema: PersonalizationSchema.CONTENT_CARD,
    data: { foo: 'bar' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('track(eventType) calls native with null interaction and tokens', () => {
    const item = new PropositionItem(baseData);
    item.track(MessagingEdgeEventType.DISPLAY);

    expect(NativeModules.AEPMessaging.trackPropositionItem).toHaveBeenCalledWith(
      activityID,
      null,
      MessagingEdgeEventType.DISPLAY,
      null
    );
  });

  it('track(interaction, eventType, tokens=null) forwards interaction', () => {
    const item = new PropositionItem(baseData);
    item.track('click', MessagingEdgeEventType.INTERACT, null);

    expect(NativeModules.AEPMessaging.trackPropositionItem).toHaveBeenCalledWith(
      activityID,
      'click',
      MessagingEdgeEventType.INTERACT,
      null
    );
  });     

  it('track(interaction, eventType, tokens[]) forwards tokens array', () => {
    const item = new PropositionItem(baseData);
    const tokens = ['t1', 't2'];
    item.track('click', MessagingEdgeEventType.INTERACT, tokens);

    expect(NativeModules.AEPMessaging.trackPropositionItem).toHaveBeenCalledWith(
      activityID,
      'click',
      MessagingEdgeEventType.INTERACT,
      tokens
    );
  });

  it('track(null, eventType, tokens[]) supports null interaction with tokens', () => {
    const item = new PropositionItem(baseData);
    const tokens = ['a'];
    item.track(null, MessagingEdgeEventType.DISPLAY, tokens);

    expect(NativeModules.AEPMessaging.trackPropositionItem).toHaveBeenCalledWith(
      activityID,
      null,
      MessagingEdgeEventType.DISPLAY,
      tokens
    );
  });
});


