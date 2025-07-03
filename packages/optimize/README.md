# React Native AEP Optimize Extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepoptimize.svg)](https://www.npmjs.com/package/@adobe/react-native-aepoptimize)
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepoptimize)](https://www.npmjs.com/package/@adobe/react-native-aepoptimize)

`@adobe/react-native-aepoptimize` is a wrapper around the iOS and Android [Adobe Experience Platform Optimize Extension](https://developer.adobe.com/client-sdks/documentation/adobe-journey-optimizer-decisioning) to allow for integration with React Native applications.

## Peer Dependencies

The Adobe Experience Platform Optimize extension has the following peer dependency, which must be installed prior to installing the optimize extension:

- [Core](../core/README.md)
- [Edge](../edge/README.md)
- [Edge Identity](../edgeidentity/README.md)

## Installation

See [Requirements and Installation](https://github.com/adobe/aepsdk-react-native#requirements) instructions on the main page

Install the `@adobe/react-native-aepoptimize` package:

NPM:

```bash
npm install @adobe/react-native-aepoptimize
```

Yarn:

```bash
yarn add @adobe/react-native-aepoptimize
```

> [!NOTE]  
> The `@adobe/react-native-aepoptimize` package introduced a **breaking change** affecting the `score` data type, causing a build failure due to a lossy conversion from `double` to `int`. To resolve this, **upgrade to version 6.1.0 or later**. Refer to the [Adobe SDK Release Notes](https://developer.adobe.com/client-sdks/home/release-notes/) for details.

## Usage

### Initializing with SDK:

To initialize the SDK, use the following methods:
- [MobileCore.initializeWithAppId(appId)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#initializewithappid)
- [MobileCore.initialize(initOptions)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#initialize)

Refer to the root [Readme](https://github.com/adobe/aepsdk-react-native/blob/main/README.md) for more information about the SDK setup.

### Importing the extension:

```typescript
import {
  Optimize,
  Offer,
  Proposition,
  DecisionScope,
} from "@adobe/react-native-aepoptimize";
```

## API reference

### Clearing the cached Propositions:

**Syntax**

```typescript
clearCachedPropositions();
```

**Example**

```typescript
Optimize.clearCachedPropositions();
```

### Getting the SDK version:

**Syntax**

```typescript
extensionVersion(): Promise<string>
```

**Example**

```typescript
Optimize.extensionVersion().then(newVersion => console.log("AdobeExperienceSDK: Optimize version: " + newVersion));
```

### Getting the Cached Propositions:

This API returns the cached propositions for the provided DecisionScopes from the in-memory Proposition cache.

**Syntax**

```typescript
getPropositions(decisionScopes: Array<DecisionScope>): Promise<Map<string, Proposition>>
```

**Example**

```typescript
const decisionScopeText = new DecisionScope("{DecisionScope name}");
const decisionScopeImage = new DecisionScope("{DecisionScope name}");
const decisionScopeHtml = new DecisionScope("{DecisionScope name{");
const decisionScopeJson = new DecisionScope("{DecisionScope name}");
const decisionScopes = [
  decisionScopeText,
  decisionScopeImage,
  decisionScopeHtml,
  decisionScopeJson,
];

Optimize.getPropositions(decisionScopes).then(
  (propositions: Map<string, typeof Proposition>) => {
    //Your app logic using the propositions
  }
);
```

### Adding onPropositionUpdate callback:

Callback that will be called with the updated Propositions.

**Syntax**

```typescript
onPropositionUpdate(adobeCallback: AdobeCallback)
```

**Example**

```typescript
Optimize.onPropositionUpdate({
  call(proposition: Map<String, typeof Proposition>) {
    //App logic using the updated proposition
  },
});
```

### updating the propositions:

This API fetches the propositions for the provided DecisionScope list.

**Syntax**

```typescript
updatePropositions(decisionScopes: Array<DecisionScope>, xdm?: Map<string, any>, data?: Map<string, any>)
```

**Example**

```typescript
const decisionScopeText = new DecisionScope("{DecisionScope name}");
const decisionScopeImage = new DecisionScope("{DecisionScope name}");
const decisionScopeHtml = new DecisionScope("{DecisionScope name{");
const decisionScopeJson = new DecisionScope("{DecisionScope name}");
const decisionScopes = [
  decisionScopeText,
  decisionScopeImage,
  decisionScopeHtml,
  decisionScopeJson,
];

Optimize.updatePropositions(decisionScopes, null, null);
```

### Batching multiple display propositions track events:

The Optimize SDK now provides enhanced support for batching multiple display propositions track events. The following APIs are available:

#### displayed

**Syntax**

```typescript
displayed(offerPairs: Array<{ proposition: Proposition; offerId: string }>)
```

**Example**

```typescript
const propositions: Map<string, Proposition> = await Optimize.getPropositions(decisionScopes);
const offerPairs: Array<{ proposition: Proposition; offerId: string }> = [];

propositions.forEach((proposition: Proposition) => {
  if (proposition && proposition.items) {
    proposition.items.forEach((offer) => {
      offerPairs.push({
        proposition,
        offerId: offer.id,
      });
    });
  }
});

Optimize.displayed(offerPairs);
```

#### generateDisplayInteractionXdm

**Syntax**

```typescript
generateDisplayInteractionXdm(offerPairs: Array<{ proposition: Proposition; offerId: string }>): Promise<Map<string, any>>
```

**Example**

```typescript
const propositions: Map<string, Proposition> = await Optimize.getPropositions(decisionScopes);
const offerPairs: Array<{ proposition: Proposition; offerId: string }> = [];

propositions.forEach((proposition: Proposition) => {
  if (proposition && proposition.items) {
    proposition.items.forEach((offer) => {
      offerPairs.push({
        proposition,
        offerId: offer.id,
      });
    });
  }
});

const xdmData = await Optimize.generateDisplayInteractionXdm(offerPairs);
// use xdmData as needed

```

---

## Public classes

- [DecisionScope](#decisionscope)
- [Proposition](#proposition)
- [Offer](#offer)

### DecisionScope

This class represents the decision scope which is used to fetch the decision propositions from the Edge decisioning services. The encapsulated scope name can also represent the Base64 encoded JSON string created using the provided activityId, placementId and itemCount.

```typescript
/**
 * class represents a decision scope used to fetch personalized offers from the Experience Edge network.
 */
module.exports = class DecisionScope {
  name: string;

  constructor(
    name?: string,
    activityId?: string,
    placementId?: string,
    itemCount?: number
  ) {
    if (name && name.trim()) {
      this.name = name;
    } else {
      const decisionScopeObject = {};
      decisionScopeObject["activityId"] = activityId;
      decisionScopeObject["placementId"] = placementId;
      decisionScopeObject["itemCount"] = itemCount;
      this.name = Buffer.from(JSON.stringify(decisionScopeObject)).toString(
        "base64"
      );
    }
  }

  /**
   * Gets the name of this scope
   * @return {string} - The name of the scope
   */
  getName(): string {
    return this.name;
  }
};
```

### Proposition

This class represents the decision propositions received from the decisioning services, upon a personalization query request to the Experience Edge network.

```typescript
module.exports = class Proposition {
  id: string;
  items: Array<Offer>;
  scope: string;
  scopeDetails: Map<string, any>;

  constructor(eventData: PropositionEventData) {
    this.id = eventData["id"];
    this.scope = eventData["scope"];
    this.scopeDetails = eventData["scopeDetails"];
    if (eventData["items"]) {
      this.items = eventData["items"].map((offer) => new Offer(offer));
    }
  }

  /**
   * Generates a map containing XDM formatted data for {Experience Event - Proposition Reference} field group from proposition arguement.
   * The returned XDM data does not contain eventType for the Experience Event.
   * @return {Promise<Map<string, any>>} a promise that resolves to xdm data map
   */
  generateReferenceXdm(): Promise<Map<string, any>> {
    const entries = Object.entries(this).filter(
      ([key, value]) => typeof value !== "function"
    );
    const proposition = Object.fromEntries(entries);
    return Promise.resolve(RCTAEPOptimize.generateReferenceXdm(proposition));
  }
};
```

### Offer

This class represents the proposition option received from the decisioning services, upon a personalization query to the Experience Edge network.

```typescript
module.exports = class Offer {
  id: string;
  etag: string;
  schema: string;
  data: Record<string, any>;
  meta?: Record<string, any>;

  get content(): string {
    return this.data["content"];
  }

  get format(): string {
    return this.data["format"];
  }

  get language(): Array<string> {
    return this.data["language"];
  }

  get characteristics(): Map<string, any> {
    return this.data["characteristics"];
  }

  constructor(eventData: OfferEventData) {
    this.id = eventData["id"];
    this.etag = eventData["etag"];
    this.schema = eventData["schema"];
    this.data = eventData["data"];
    this.meta = eventData["meta"];
  }

  /**
   * Dispatches an event for the Edge network extension to send an Experience Event to the Edge network with the display interaction data for the
   * given Proposition offer.
   * @param {Proposition} proposition - the proposition this Offer belongs to
   */
  displayed(proposition: Proposition): void {
    const entries = Object.entries(proposition).filter(
      ([key, value]) => typeof value !== "function"
    );
    const cleanedProposition = Object.fromEntries(entries);
    RCTAEPOptimize.offerDisplayed(this.id, cleanedProposition);
  }

  /**
   * Dispatches an event for the Edge network extension to send an Experience Event to the Edge network with the tap interaction data for the
   * given Proposition offer.
   * @param {Proposition} proposition - the proposition this Offer belongs to
   */
  tapped(proposition: Proposition): void {
    console.log("Offer is tapped");
    const entries = Object.entries(proposition).filter(
      ([key, value]) => typeof value !== "function"
    );
    const cleanedProposition = Object.fromEntries(entries);
    RCTAEPOptimize.offerTapped(this.id, cleanedProposition);
  }

  /**
   * Generates a map containing XDM formatted data for {Experience Event - Proposition Interactions} field group from proposition arguement.
   * The returned XDM data does contain the eventType for the Experience Event with value decisioning.propositionDisplay.
   * Note: The Edge sendEvent API can be used to dispatch this data in an Experience Event along with any additional XDM, free-form data, and override
   * dataset identifier.
   * @param {Proposition} proposition - the proposition this Offer belongs to
   * @return {Promise<Map<string, any>>} - a promise that resolves to xdm map
   */
  generateDisplayInteractionXdm(
    proposition: Proposition
  ): Promise<Map<string, any>> {
    const entries = Object.entries(proposition).filter(
      ([key, value]) => typeof value !== "function"
    );
    const cleanedProposition = Object.fromEntries(entries);
    return Promise.resolve(
      RCTAEPOptimize.generateDisplayInteractionXdm(this.id, cleanedProposition)
    );
  }

  /**
   * Generates a map containing XDM formatted data for {Experience Event - Proposition Interactions} field group from this proposition arguement.
   * The returned XDM data contains the eventType for the Experience Event with value decisioning.propositionInteract.
   * Note: The Edge sendEvent API can be used to dispatch this data in an Experience Event along with any additional XDM, free-form data, and override
   * dataset identifier.
   * @param {Proposition} proposition - proposition this Offer belongs to
   * @return {Promise<Map<string, any>>} a promise that resolves to xdm map
   */
  generateTapInteractionXdm(
    proposition: Proposition
  ): Promise<Map<string, any>> {
    const entries = Object.entries(proposition).filter(
      ([key, value]) => typeof value !== "function"
    );
    const cleanedProposition = Object.fromEntries(entries);
    return Promise.resolve(
      RCTAEPOptimize.generateTapInteractionXdm(this.id, cleanedProposition)
    );
  }
};
```
