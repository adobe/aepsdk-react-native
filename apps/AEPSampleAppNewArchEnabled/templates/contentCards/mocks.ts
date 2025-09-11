import {
    IMAGE_ONLY_CONTENT_ALL_FIELDS,
    IMAGE_ONLY_CONTENT_DISMISS_BUTTON_CIRCLE,
    IMAGE_ONLY_CONTENT_INVALID_IMAGE,
    IMAGE_ONLY_CONTENT_NO_DARK_URL,
    IMAGE_ONLY_CONTENT_NO_DISMISS_BUTTON,
    IMAGE_ONLY_CONTENT_NO_LIGHT_MODE,
    IMAGE_ONLY_CONTENT_NO_ACTION
  } from './imageOnly';
  import {
    LARGE_IMAGE_CONTENT_3_BUTTONS,
    LARGE_IMAGE_CONTENT_ALL_FIELDS,
    LARGE_IMAGE_CONTENT_DARK_URL,
    LARGE_IMAGE_CONTENT_INVALID_IMAGE,
    LARGE_IMAGE_CONTENT_LONG_TITLE,
    LARGE_IMAGE_CONTENT_NO_DISMISS_BUTTON
  } from './largeImage';
  import {
    SMALL_IMAGE_CONTENT_3_BUTTONS,
    SMALL_IMAGE_CONTENT_ALL_FIELDS,
    SMALL_IMAGE_CONTENT_DISMISS_BUTTON_SIMPLE,
    SMALL_IMAGE_CONTENT_IMAGE_DARK_URL,
    SMALL_IMAGE_CONTENT_INVALID_IMAGE,
    SMALL_IMAGE_CONTENT_NO_BUTTON,
    SMALL_IMAGE_CONTENT_NO_DISMISS_BUTTON
  } from './smallImage';
  
  
  export type DemoItem = {
    key: string;
    template: any; // ContentTemplate
    renderText: string;
    styleOverrides?: any; // ContentView props styleOverrides
    listener?: (event: any, card?: any) => void;
    customThemes?: {
        light?: { colors?: any };
        dark?: { colors?: any };
      };
  };
  
  // SmallImage
  export const SMALL_ITEMS: DemoItem[] = [
    {
      key: '1',
      template: SMALL_IMAGE_CONTENT_ALL_FIELDS,
      renderText: '[Basic] all fields',
      styleOverrides: {
        smallImageStyle: {
          card: {
            backgroundColor: '#800080',
            borderRadius: 20,
            margin: 15
          },
          title: {
            color: '#FF0000'
          },
          body: {
            color: '#00FF00'
          }
        }
      },
      listener: (event, card) => {
        console.log('Event triggered:', event, card);
      },
    },
    {
      key: '13',
      template: SMALL_IMAGE_CONTENT_ALL_FIELDS,
      renderText: '[dark/light]Custom theme',
      listener:(event, card) => {
        console.log('Event triggered:', event, card);
      },
      customThemes: {
        light: { colors: { textPrimary: 'red', background: 'oldlace', buttonTextColor: 'orange' } },
        dark:  { colors: { textPrimary: 'green', background: 'lightblue', buttonTextColor: 'mediumorchid' } }
      }
    },
    {
      key: '11',
      template: SMALL_IMAGE_CONTENT_NO_DISMISS_BUTTON,
      renderText: '[dismiss button] NO ',
    },
    {
      key: '12',
      template: SMALL_IMAGE_CONTENT_DISMISS_BUTTON_SIMPLE,
      renderText: '[dismiss button] Simple',
    },
    {
      key: '2',
      template: SMALL_IMAGE_CONTENT_INVALID_IMAGE,
      renderText: '[image] Invalid',
      styleOverrides: {
        smallImageStyle: {
          card: {
            backgroundColor: '#800080',
            borderRadius: 20,
            margin: 15,
            padding: 10
          },
          title: {
            color: '#FF0000'
          },
          body: {
            color: '#00FF00'
          }
        }
      },
    },
    {
      key: '3',
      template: SMALL_IMAGE_CONTENT_IMAGE_DARK_URL,
      renderText: '[dark/light] darkUrl',
    },
    {
      key: '4',
      template: SMALL_IMAGE_CONTENT_IMAGE_DARK_URL,
      renderText: '[style]title (2 lines), body (4 lines)',
      styleOverrides: {
        smallImageStyle: {
          card: {
            backgroundColor: '#800080',
            borderRadius: 20,
            margin: 15,
            padding: 10
          },
          title: {
            color: '#FF0000'
          },
          body: {
            color: '#00FF00'
          }
        }
      },
      listener:(event, card) => {
        console.log('Event triggered:', event, card);
      }
    },
    {
      key: '5',
      template: SMALL_IMAGE_CONTENT_3_BUTTONS,
      renderText: '[button] 3',
    },
    {
      key: '6', 
      template: SMALL_IMAGE_CONTENT_IMAGE_DARK_URL,
      renderText: '[style] height (150) title (1 line), body (1 line)',
      styleOverrides:{
        smallImageStyle: {
          title: {
            fontSize: 16
          },
          body: {
            fontSize: 14
          }
        }
      }
    },
    {
      key: '14',
      template: SMALL_IMAGE_CONTENT_IMAGE_DARK_URL,
      renderText: 'image width (50%)',
      styleOverrides: {
        smallImageStyle: {
          title: { fontSize: 16, fontWeight: '600' },
          body: { fontSize: 14, lineHeight: 18 },
          imageContainer: {
            width: '50%'
          }
        }
      }
    },
    {
      key: '7',
      template: SMALL_IMAGE_CONTENT_NO_BUTTON,
      renderText: 'No button, image width (40%), title (2 lines), body (6 lines), height (180)',
      styleOverrides: {
        smallImageStyle: {
          title: { fontSize: 16, fontWeight: '600' },
          body: { fontSize: 14, lineHeight: 18 },
          imageContainer: {
            width: '40%'
          }
        }
      }
    },
    {
      key: '8',
      template: SMALL_IMAGE_CONTENT_NO_BUTTON,
      renderText: 'No button, image (right aligned)',
      styleOverrides: {
        smallImageStyle: {
          title: { fontSize: 16, fontWeight: '600' },
          body: { fontSize: 14, lineHeight: 18 },
          container: {
            flexDirection: 'row-reverse'
          },
          imageContainer: {
            width: '40%'
          }
        }
      }
    }
  ];
  
  export const LARGE_ITEMS: DemoItem[] = [
    {
      key: '1',
      template: LARGE_IMAGE_CONTENT_ALL_FIELDS,
      renderText: '[Basic] all fields',
    },
    {
      key: '2',
      template: LARGE_IMAGE_CONTENT_3_BUTTONS,
      renderText: '[button] 3',
    },
    {
      key: '3',
      template: LARGE_IMAGE_CONTENT_NO_DISMISS_BUTTON,
      renderText: '[dismiss button] NO ',
    },
    {
      key: '4',
      template: LARGE_IMAGE_CONTENT_INVALID_IMAGE,
      renderText: '[image] Invalid',
    },
    {
      key: '5',
      template: LARGE_IMAGE_CONTENT_DARK_URL,
      renderText: '[dark/light] darkUrl',
    },
    {
      key: '6',
      template: LARGE_IMAGE_CONTENT_LONG_TITLE,
      renderText: '[style]title (2 lines), body (2 lines), image (1:1)',
      styleOverrides: {
        largeImageStyle: {
          title: {
            fontSize: 18,
            fontWeight: '600'
          },
          body: {
            fontSize: 14,
            lineHeight: 18
          },
          image: {
            aspectRatio: 1 / 1
          }
        }
    },
    listener: (event, card) => {
      console.log('Event triggered:', event, card);
    }
  },
  {
    key: '7',
    template: LARGE_IMAGE_CONTENT_DARK_URL,
    renderText: '[dark/light]Custom theme',
    customThemes: {
      light: {
        colors: {
          textPrimary: 'red',
          background: 'oldlace',
          buttonTextColor: 'orange'
        }
      },
      dark: {
        colors: {
          textPrimary: 'green',
          background: 'lightblue',
          buttonTextColor: 'mediumorchid'
        }
      }
    },
    listener: (event, card) => {
      console.log('Event triggered:', event, card);
    }
  }
  ]
  
  export const IMAGE_ONLY_ITEMS: DemoItem[] = [
    {
      key: '1',
      template: IMAGE_ONLY_CONTENT_ALL_FIELDS,
      renderText: '1. All fields',
      listener: (event, card) => {
        console.log(
          'Event triggered: - for imageOnly image 1',
          event,
          card
        );
      }
    },
    {
      key: '2',
      template: IMAGE_ONLY_CONTENT_DISMISS_BUTTON_CIRCLE,
      renderText: '2.Adobe default image, dismiss style circle',
      listener: (event, card) => {
        console.log(
          'Event triggered: - for imageOnly image 2',
          event,
          card
        );
      }
    },
    {
      key: '3',
      template: IMAGE_ONLY_CONTENT_NO_DISMISS_BUTTON,
      renderText: '3. No dismiss button - no card height',
    },
    {
      key: '4',
      template: IMAGE_ONLY_CONTENT_INVALID_IMAGE,
      renderText: '4. [image] Invalid',
    },
    {
      key: '5',
      template: IMAGE_ONLY_CONTENT_NO_ACTION,
      renderText: '5. [action] No actionUrl',
    },
    {
      key: '6',
      template: IMAGE_ONLY_CONTENT_ALL_FIELDS,
      renderText: '6. [style] Custom aspect ratio (1:1)',
      styleOverrides: {
        imageOnlyStyle: {
          image: {
            aspectRatio: 1 / 1
          }
        }
      },
      listener: (event, card) => {
        console.log(
          'Event triggered: - for imageOnly image 7',
          event,
          card
        );
      }
    },
    {
      key: '7',
      template: IMAGE_ONLY_CONTENT_ALL_FIELDS,
      renderText: '7. [style] Custom height (150)',
      styleOverrides: {
        imageOnlyStyle: {
          image: {
            height: 150
          }
        }
      }
    },
    {
      key: '8',
      template: IMAGE_ONLY_CONTENT_ALL_FIELDS,
      renderText: '8. [style] Custom width (80%), set image container backgroud color',
      styleOverrides: {
        imageOnlyStyle: {
          image: {
            width: '80%'
          },
          imageContainer: {
            backgroundColor: '#79f4bbff'
          }
        }
      }
    },
    {
      key: '9',
      template: IMAGE_ONLY_CONTENT_ALL_FIELDS,
      renderText: '9. [style] Card customization',
      styleOverrides: {
        imageOnlyStyle: {
          card: {
            borderRadius: 80,
            margin: 30
          },
          image: {
            width: '50%',
            resizeMode: 'stretch'
          }
        }
      }
    },
    {
      key: '10',
      template: IMAGE_ONLY_CONTENT_ALL_FIELDS,
      renderText: '10. [style] Image container customization',
      styleOverrides: {
        imageOnlyStyle: {
          imageContainer: {
            borderRadius: 15,
            borderWidth: 5,
            borderColor: '#FF69B4',
            maxHeight: 100
          },
          image: {
            resizeMode: 'center',
            backgroundColor: '#79f4bbff',
            maxHeight: 90
          }
        }
      }
    },
    {
      key: '11',
      template: IMAGE_ONLY_CONTENT_ALL_FIELDS,
      renderText: '11. [style] Combined styles',
      styleOverrides: {
        imageOnlyStyle: {
          card: {
            margin: 5,
            borderRadius: 0
          },
          imageContainer: {
            backgroundColor: '#E6E6FA',
            minHeight: 180
          },
          image: {
            resizeMode: 'cover'
          }
        }
      }
    },
    {
      key: '12',
      template: IMAGE_ONLY_CONTENT_NO_DARK_URL,
      renderText: '12. [image] No darkUrl (only light mode)',
    },
    {
      key: '15',
      template: IMAGE_ONLY_CONTENT_NO_LIGHT_MODE,
      renderText: '1.[image] No Light Mode (only dark mode) - no actionUrl',
    },
  ]
  