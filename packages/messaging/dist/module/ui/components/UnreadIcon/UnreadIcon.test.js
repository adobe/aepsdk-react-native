// /*
//   Copyright 2025 Adobe. All rights reserved.
//   This file is licensed to you under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License. You may obtain a copy
//   of the License at http://www.apache.org/licenses/LICENSE-2.0
//   Unless required by applicable law or agreed to in writing, software distributed under
//   the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
//   OF ANY KIND, either express or implied. See the License for the specific language
//   governing permissions and limitations under the License.
// */

// import React from 'react';
// import renderer from 'react-test-renderer';
// import { useColorScheme } from 'react-native';
// import UnreadIcon from './UnreadIcon';
// import ContentCardContainerProvider from '../../providers/ContentCardContainerProvider';

// // Mock useColorScheme
// jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
//   default: jest.fn(),
// }));

// const mockUseColorScheme = useColorScheme as jest.MockedFunction<typeof useColorScheme>;

// describe('UnreadIcon', () => {
//   const mockContainerSettings = {
//     templateType: 'inbox' as const,
//     content: {
//       heading: { content: 'Test' },
//       layout: { orientation: 'vertical' as const },
//       capacity: 10,
//       emptyStateSettings: { message: { content: 'Empty' } },
//       unread_indicator: {
//         unread_bg: {
//           clr: {
//             light: '#FFF3E0',
//             dark: '#2D1B0E',
//           },
//         },
//         unread_icon: {
//           placement: 'topright' as const,
//           image: {
//             url: 'https://example.com/icon.png',
//             darkUrl: '',
//           },
//         },
//       },
//       isUnreadEnabled: true,
//     },
//     showPagination: false,
//   };

//   beforeEach(() => {
//     jest.clearAllMocks();
//     mockUseColorScheme.mockReturnValue('light');
//   });

//   describe('Rendering', () => {
//     it('should render successfully with container settings', () => {
//       const component = renderer.create(
//         <ContentCardContainerProvider settings={mockContainerSettings}>
//           <UnreadIcon />
//         </ContentCardContainerProvider>
//       );

//       const tree = component.toJSON();
//       expect(tree).toBeTruthy();
//     });

//     it('should render with custom size', () => {
//       const component = renderer.create(
//         <ContentCardContainerProvider settings={mockContainerSettings}>
//           <UnreadIcon size={30} />
//         </ContentCardContainerProvider>
//       );

//       const tree = component.toJSON();
//       expect(tree).toBeTruthy();
//     });
//   });

//   describe('Placement', () => {
//     it('should render with topright placement', () => {
//       const component = renderer.create(
//         <ContentCardContainerProvider settings={mockContainerSettings}>
//           <UnreadIcon />
//         </ContentCardContainerProvider>
//       );

//       const tree = component.toJSON();
//       expect(tree).toBeTruthy();
//     });

//     it('should render with topleft placement', () => {
//       const settings = {
//         ...mockContainerSettings,
//         content: {
//           ...mockContainerSettings.content,
//           unread_indicator: {
//             ...mockContainerSettings.content.unread_indicator,
//             unread_icon: {
//               ...mockContainerSettings.content.unread_indicator.unread_icon,
//               placement: 'topleft' as const,
//             },
//           },
//         },
//       };

//       const component = renderer.create(
//         <ContentCardContainerProvider settings={settings}>
//           <UnreadIcon />
//         </ContentCardContainerProvider>
//       );

//       const tree = component.toJSON();
//       expect(tree).toBeTruthy();
//     });

//     it('should render with bottomright placement', () => {
//       const settings = {
//         ...mockContainerSettings,
//         content: {
//           ...mockContainerSettings.content,
//           unread_indicator: {
//             ...mockContainerSettings.content.unread_indicator,
//             unread_icon: {
//               ...mockContainerSettings.content.unread_indicator.unread_icon,
//               placement: 'bottomright' as const,
//             },
//           },
//         },
//       };

//       const component = renderer.create(
//         <ContentCardContainerProvider settings={settings}>
//           <UnreadIcon />
//         </ContentCardContainerProvider>
//       );

//       const tree = component.toJSON();
//       expect(tree).toBeTruthy();
//     });

//     it('should render with bottomleft placement', () => {
//       const settings = {
//         ...mockContainerSettings,
//         content: {
//           ...mockContainerSettings.content,
//           unread_indicator: {
//             ...mockContainerSettings.content.unread_indicator,
//             unread_icon: {
//               ...mockContainerSettings.content.unread_indicator.unread_icon,
//               placement: 'bottomleft' as const,
//             },
//           },
//         },
//       };

//       const component = renderer.create(
//         <ContentCardContainerProvider settings={settings}>
//           <UnreadIcon />
//         </ContentCardContainerProvider>
//       );

//       const tree = component.toJSON();
//       expect(tree).toBeTruthy();
//     });
//   });

//   describe('Light Mode', () => {
//     beforeEach(() => {
//       mockUseColorScheme.mockReturnValue('light');
//     });

//     it('should render in light mode with image URL', () => {
//       const component = renderer.create(
//         <ContentCardContainerProvider settings={mockContainerSettings}>
//           <UnreadIcon />
//         </ContentCardContainerProvider>
//       );

//       const tree = component.toJSON();
//       expect(tree).toBeTruthy();
//     });

//     it('should render dot when URL is empty string in light mode', () => {
//       const settings = {
//         ...mockContainerSettings,
//         content: {
//           ...mockContainerSettings.content,
//           unread_indicator: {
//             ...mockContainerSettings.content.unread_indicator,
//             unread_icon: {
//               ...mockContainerSettings.content.unread_indicator.unread_icon,
//               image: {
//                 url: '',
//                 darkUrl: '',
//               },
//             },
//           },
//         },
//       };

//       const component = renderer.create(
//         <ContentCardContainerProvider settings={settings}>
//           <UnreadIcon />
//         </ContentCardContainerProvider>
//       );

//       const tree = component.toJSON();
//       expect(tree).toBeTruthy();
//     });
//   });

//   describe('Dark Mode', () => {
//     beforeEach(() => {
//       mockUseColorScheme.mockReturnValue('dark');
//     });

//     it('should render in dark mode with darkUrl provided', () => {
//       const settings = {
//         ...mockContainerSettings,
//         content: {
//           ...mockContainerSettings.content,
//           unread_indicator: {
//             ...mockContainerSettings.content.unread_indicator,
//             unread_icon: {
//               ...mockContainerSettings.content.unread_indicator.unread_icon,
//               image: {
//                 url: 'https://example.com/light.png',
//                 darkUrl: 'https://example.com/dark.png',
//               },
//             },
//           },
//         },
//       };

//       const component = renderer.create(
//         <ContentCardContainerProvider settings={settings}>
//           <UnreadIcon />
//         </ContentCardContainerProvider>
//       );

//       const tree = component.toJSON();
//       expect(tree).toBeTruthy();
//     });

//     it('should render dot when darkUrl is empty string in dark mode', () => {
//       const component = renderer.create(
//         <ContentCardContainerProvider settings={mockContainerSettings}>
//           <UnreadIcon />
//         </ContentCardContainerProvider>
//       );

//       const tree = component.toJSON();
//       expect(tree).toBeTruthy();
//     });

//     it('should fallback to light mode image when no darkUrl provided', () => {
//       const settings = {
//         ...mockContainerSettings,
//         content: {
//           ...mockContainerSettings.content,
//           unread_indicator: {
//             ...mockContainerSettings.content.unread_indicator,
//             unread_icon: {
//               placement: 'topright' as const,
//               image: {
//                 url: 'https://example.com/icon.png',
//               },
//             },
//           },
//         },
//       };

//       const component = renderer.create(
//         <ContentCardContainerProvider settings={settings}>
//           <UnreadIcon />
//         </ContentCardContainerProvider>
//       );

//       const tree = component.toJSON();
//       expect(tree).toBeTruthy();
//     });
//   });

//   describe('Error Handling', () => {
//     it('should throw error when used outside ContentCardContainerProvider', () => {
//       // Suppress console.error for this test
//       const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

//       expect(() => {
//         renderer.create(<UnreadIcon />);
//       }).toThrow('useContainerSettings must be used within a ContentCardContainerProvider');

//       consoleError.mockRestore();
//     });
//   });

//   describe('Snapshot Tests', () => {
//     it('should match snapshot for topright placement', () => {
//       const component = renderer.create(
//         <ContentCardContainerProvider settings={mockContainerSettings}>
//           <UnreadIcon />
//         </ContentCardContainerProvider>
//       );

//       const tree = component.toJSON();
//       expect(tree).toMatchSnapshot();
//     });

//     it('should match snapshot for dot in dark mode', () => {
//       mockUseColorScheme.mockReturnValue('dark');

//       const component = renderer.create(
//         <ContentCardContainerProvider settings={mockContainerSettings}>
//           <UnreadIcon />
//         </ContentCardContainerProvider>
//       );

//       const tree = component.toJSON();
//       expect(tree).toMatchSnapshot();
//     });
//   });
// });
"use strict";
//# sourceMappingURL=UnreadIcon.test.js.map