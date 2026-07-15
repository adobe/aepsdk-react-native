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

import {
  DeviceEventEmitter,
  EventSubscription,
  NativeEventEmitter,
  NativeModules,
  Platform,
  TurboModuleRegistry,
} from 'react-native';
import Proposition from './models/Proposition';
import { AdobePropositionCallback } from './models/AdobePropositionCallback';
import type { PropositionsPayload, Spec } from './NativeAEPOptimize';
import NativeAEPOptimize from './NativeAEPOptimize';

/** Bridge / DeviceEventEmitter name (legacy interop + Android). */
export const INTEROP_PROPOSITIONS_EVENT = 'onPropositionsUpdate';

export function deliverPropositions(
  adobeCallback: AdobePropositionCallback,
  raw: { propositions?: Record<string, unknown> } | Record<string, unknown>
) {
  try {
    const propositionsObj =
      raw != null && typeof raw === 'object' && 'propositions' in raw && raw.propositions != null
        ? raw.propositions
        : raw;
    const map = new Map<string, Proposition>();
    for (const [key, value] of Object.entries(propositionsObj ?? {})) {
      map.set(key, new Proposition(value as any));
    }
    adobeCallback.call(map);
  } catch (error) {
    console.error('[AEPOptimize] deliverPropositions failed:', error);
  }
}

type JsiEventEmitter =
  | ((handler: (event: PropositionsPayload) => void) => EventSubscription)
  | {
      addListener?: (handler: (event: PropositionsPayload) => void) => EventSubscription;
    };

function getJsiEventEmitter(): JsiEventEmitter | undefined {
  const fromRegistry = TurboModuleRegistry.get<Spec>('NativeAEPOptimize')?.onPropositionsUpdated;
  const fromModule = (NativeAEPOptimize as unknown as { onPropositionsUpdated?: JsiEventEmitter })
    .onPropositionsUpdated;
  return (fromRegistry ?? fromModule) as JsiEventEmitter | undefined;
}

function trySubscribeTurboJsi(
  handler: (payload: Record<string, unknown> | { propositions?: Record<string, unknown> }) => void
): EventSubscription | null {
  const emitter = getJsiEventEmitter();
  if (emitter == null) {
    return null;
  }
  try {
    if (typeof emitter === 'function') {
      return emitter(handler as (event: PropositionsPayload) => void);
    }
    if (typeof emitter === 'object' && typeof emitter.addListener === 'function') {
      return emitter.addListener(handler as (event: PropositionsPayload) => void);
    }
  } catch {
    // Android codegen EventEmitter is not always JS-callable on older RN builds.
  }
  return null;
}

/**
 * Subscribe to native proposition-update events across RN 0.76–0.85 paths:
 * - iOS/Android turbo + new-arch interop: codegen JSI EventEmitter (onPropositionsUpdated)
 * - Android (all): DeviceEventEmitter (onPropositionsUpdate, flat map)
 * - iOS old-arch interop: NativeEventEmitter + sendEventWithName
 */
export function subscribePropositionsUpdated(
  adobeCallback: AdobePropositionCallback
): EventSubscription {
  const handler = (payload: Record<string, unknown> | { propositions?: Record<string, unknown> }) =>
    deliverPropositions(adobeCallback, payload);
  const subs: EventSubscription[] = [];

  if (Platform.OS === 'android') {
    // Android (interop + turbo): codegen EventEmitter is not JS-callable — use DeviceEventEmitter.
    subs.push(DeviceEventEmitter.addListener(INTEROP_PROPOSITIONS_EVENT, handler));
  } else {
    // iOS turbo + new-arch interop: codegen JSI EventEmitter.
    const jsiSub = trySubscribeTurboJsi(handler);
    if (jsiSub) {
      subs.push(jsiSub);
    } else {
      // iOS old-arch interop: sendEventWithName → DeviceEventEmitter.
      const bridgeModule = (NativeModules as { NativeAEPOptimize?: object }).NativeAEPOptimize;
      if (bridgeModule) {
        subs.push(
          new NativeEventEmitter(bridgeModule as any).addListener(INTEROP_PROPOSITIONS_EVENT, handler)
        );
      }
    }
  }

  return {
    remove: () => {
      subs.forEach((s) => s.remove());
    },
  } as EventSubscription;
}
