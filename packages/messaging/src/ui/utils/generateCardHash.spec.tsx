/*
    Copyright 2026 Adobe. All rights reserved.
    This file is licensed to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law
    or agreed to in writing, software distributed under the License is
    distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS OF
    ANY KIND, either express or implied. See the License for the specific language
    governing permissions and limitations under the License.
*/

import { generateCardHash } from './generateCardHash';

describe('generateCardHash', () => {
  it('returns content: hash from title, body, image, actionUrl, and type', () => {
    const card = {
      id: 'ignored-when-content',
      type: 'LargeImage',
      data: {
        content: {
          actionUrl: 'https://go',
          title: { content: 'T' },
          body: { content: 'B' },
          image: { url: 'https://img' },
        },
      },
    };
    expect(generateCardHash(card as any)).toBe(
      'content:https://go|T|B|https://img|LargeImage'
    );
  });

  it('uses meta.adobe.template when type is missing', () => {
    const card = {
      data: {
        meta: { adobe: { template: 'SmallImage' } },
        content: {
          title: { content: 'X' },
        },
      },
    };
    expect(generateCardHash(card as any)).toContain('|SmallImage');
  });

  it('uses darkUrl when url is missing', () => {
    const card = {
      type: 'SmallImage',
      data: {
        content: {
          title: { content: 'T' },
          image: { darkUrl: 'https://dark.png' },
        },
      },
    };
    expect(generateCardHash(card as any)).toContain('https://dark.png');
  });

  it('uses uuid when content is present but all parts are empty', () => {
    const card = {
      uuid: 'u-1',
      data: {
        content: {
          title: { content: '' },
          body: { content: '' },
        },
      },
    };
    expect(generateCardHash(card as any)).toBe('uuid:u-1');
  });

  it('uses id when no usable content hash and no uuid', () => {
    const card = {
      id: 'card-99',
      data: {},
    };
    expect(generateCardHash(card as any)).toBe('id:card-99');
  });

  it('uses fallback with Math.random when no content, uuid, or id', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.25);
    const card = { data: {} };
    expect(generateCardHash(card as any)).toBe('fallback:0.25');
    jest.restoreAllMocks();
  });
});
