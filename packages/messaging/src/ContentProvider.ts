/*
    Copyright 2025 Adobe. All rights reserved.
    This file is licensed to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law
    or agreed to in writing, software distributed under the License is
    distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS OF
    ANY KIND, either express or implied. See the License for the specific
    language governing permissions and limitations under the License.
*/
import { SmallImageContentData, LargeImageContentData, ImageOnlyContentData } from "@adobe/react-native-aepui";
import Messaging from "./Messaging";
import { PersonalizationSchema } from "./models/PersonalizationSchema";
import { ContentCard } from "./models/ContentCard";
import { MessagingProposition } from "./models/MessagingProposition";

/** Represents template types for AepUI templates. */
export enum TemplateType {
    /** Represents a small image template type. */
    SMALL_IMAGE = "SmallImage",
    /** Represents a large image template type. */
    LARGE_IMAGE = "LargeImage",
    /** Represents a image only template type. */
    IMAGE_ONLY = "ImageOnly"
}

export interface ContentTemplate {
    readonly id: string; // content card id
    readonly type: TemplateType;
    // Use Record<string, unknown> to present the free-formed JSON objects
    readonly smallImageData?: SmallImageContentData;
    readonly largeImageData?: LargeImageContentData;
    readonly imageOnlyData?: ImageOnlyContentData;
    // TODO: add metadata here ....
}

export const fetchedContentCards: Map<string, ContentCard> = new Map();

export class ContentProvider {

    // cached fetetched content card objects 

    constructor(private readonly surface: string) {
    }

    //TODO: it looks like this is not useful, it might be beeeter to remove it and move getContent() to the Messaging class
    async refreshContent(): Promise<void> {
        // Implementation to be added
        throw new Error('Method not implemented');
    }

    /** 
    * Initiates fetching of AepUI instances for the given surface.
    *
    * This function fetches new content by invoking getAepUITemplateList(), which retrieves
    * propositions and builds a list of AepUI.
    *
    * @returns A Promise that resolves to a Result containing lists of AepUITemplate.
    */
    async getContent(): Promise<ContentTemplate[]> {
        console.log(this.surface);

        const messages = await Messaging.getPropositionsForSurfaces([this.surface]);
        console.log(JSON.stringify(messages));
        const propositions = messages[this.surface];
        if (!propositions) {
            return [];
        }
        const list: ContentTemplate[] = [];
        
        for (const proposition of propositions) {
            const newProposition = new MessagingProposition(proposition);
            for (const item of newProposition.items) {
                if (item.schema === PersonalizationSchema.CONTENT_CARD) {
                    const contentCard =  (item as any);

                    // Add to the mapping manager for tracking purposes
                    fetchedContentCards.set(contentCard.id, contentCard);
                    const templateType = contentCard.data?.meta?.adobe?.template as string;
                    switch (templateType) {
                        case "SmallImage":
                            list.push({
                                id: contentCard.id,
                                type: TemplateType.SMALL_IMAGE,
                                smallImageData: contentCard.data.content
                            })
                            break;
                        case "LargeImage":
                            list.push({
                                id: contentCard.id,
                                type: TemplateType.LARGE_IMAGE,
                                largeImageData: contentCard.data.content
                            })
                            break;
                        case "ImageOnly":
                            list.push({
                                id: contentCard.id,
                                type: TemplateType.IMAGE_ONLY,
                                imageOnlyData: contentCard.data.content
                            })
                            break;
                        default:
                            console.error(`Unknown template type: ${templateType}`);
                    }
                }
            }
        }

        return list;
    }
}