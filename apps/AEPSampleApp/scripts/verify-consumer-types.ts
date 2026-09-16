// Isolated consumer type-resolution smoke test (see issue #593).
//
// This deliberately does NOT typecheck the rest of AEPSampleApp — the
// app's own source can have unrelated in-progress errors without
// masking a real regression here. It only proves what an external
// consumer would experience: importing every published
// @adobe/react-native-* package and resolving its published types via
// node_modules, under the same "bundler" moduleResolution RN/Metro
// actually uses. If any package ships without a valid .d.ts, this
// fails with the exact TS7016 a customer would hit.

import * as AEPAssurance from '@adobe/react-native-aepassurance';
import * as AEPCampaignClassic from '@adobe/react-native-aepcampaignclassic';
import * as AEPCore from '@adobe/react-native-aepcore';
import * as AEPEdge from '@adobe/react-native-aepedge';
import * as AEPEdgeBridge from '@adobe/react-native-aepedgebridge';
import * as AEPEdgeConsent from '@adobe/react-native-aepedgeconsent';
import * as AEPEdgeIdentity from '@adobe/react-native-aepedgeidentity';
import * as AEPMessaging from '@adobe/react-native-aepmessaging';
import * as AEPOptimize from '@adobe/react-native-aepoptimize';
import * as AEPPlaces from '@adobe/react-native-aepplaces';
import * as AEPTarget from '@adobe/react-native-aeptarget';
import * as AEPUserProfile from '@adobe/react-native-aepuserprofile';

export const _consumerTypeResolutionCheck = {
  AEPAssurance,
  AEPCampaignClassic,
  AEPCore,
  AEPEdge,
  AEPEdgeBridge,
  AEPEdgeConsent,
  AEPEdgeIdentity,
  AEPMessaging,
  AEPOptimize,
  AEPPlaces,
  AEPTarget,
  AEPUserProfile,
};
