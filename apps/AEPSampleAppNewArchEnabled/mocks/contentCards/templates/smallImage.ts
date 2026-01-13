import { ContentTemplate } from '@adobe/react-native-aepmessaging';

export const SMALL_IMAGE_CONTENT_ALL_FIELDS: ContentTemplate = {
    id: 'small-image-all-fields',
    type: 'SmallImage',
    schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
    data: {
      expiryDate: Date.now() + 86400000, // 24 hours from now
      publishedDate: Date.now(),
      contentType: 'application/json',
      meta: {
        adobe: { template: 'SmallImage' as any },
        surface: 'rn/ios/sample'
      },
      content: {
        image: {
          alt: '',
          url: 'https://cdn-icons-png.flaticon.com/256/3303/3303838.png',
          darkUrl: 'https://cdn-icons-png.flaticon.com/256/3303/3303838.png'
        },
        buttons: [
          {
            interactId: 'downloadClicked',
            actionUrl: 'https://nba.com',
            id: '5b4d53f5-44bd-4e5c-a5cb-6e650b1993f6',
            text: {
              content: 'Download App'
            }
          },
          {
            interactId: 'OK',
            id: '5b4d53f5-45bd-4e3c-a5cb-6e650b1993f7',
            text: {
              content: 'OK'
            }
          }
        ],
        dismissBtn: {
          style: 'circle'
        },
        actionUrl: '',
        body: {
          content:
            'Get live scores, real-time updates, and exclusive content right at your fingertips.'
        },
        title: {
          content: 'Stay connected to all the action'
        }
      }
    }
  };
  
  export const SMALL_IMAGE_CONTENT_NO_DISMISS_BUTTON: ContentTemplate = {
    id: 'small-image-no-dismiss',
    type: 'SmallImage',
    schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
    data: {
      expiryDate: Date.now() + 86400000, // 24 hours from now
      publishedDate: Date.now(),
      contentType: 'application/json',
      meta: {
        adobe: { template: 'SmallImage' as any },
        surface: 'rn/ios/sample'
      },
      content: {
        image: {
          alt: '',
          url: 'https://cdn-icons-png.flaticon.com/256/3303/3303838.png',
          darkUrl: 'https://cdn-icons-png.flaticon.com/256/3303/3303838.png'
        },
        buttons: [
          {
            interactId: 'downloadClicked',
            actionUrl: 'https://nba.com',
            id: '5b4d53f5-45bd-4e5c-a5cb-6e65b1993f6',
            text: {
              content: 'Download App'
            }
          }
        ],
        actionUrl: '',
        body: {
          content:
            'Get live scores, real-time updates, and exclusive content right at your fingertips.'
        },
        title: {
          content: 'Stay connected to all the action'
        }
      }
    }
  };
  
  export const SMALL_IMAGE_CONTENT_DISMISS_BUTTON_SIMPLE: ContentTemplate = {
    id: 'small-image-dismiss-button-simple',
    type: 'SmallImage',
    schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
    data: {
      expiryDate: Date.now() + 86400000, // 24 hours from now
      publishedDate: Date.now(),
      contentType: 'application/json',
      meta: {
        adobe: { template: 'SmallImage' as any },
        surface: 'rn/ios/sample'
      },
      content: {
        image: {
          alt: '',
          url: 'https://cdn-icons-png.flaticon.com/256/3303/3303838.png',
          darkUrl: 'https://cdn-icons-png.flaticon.com/256/3303/3303838.png'
        },
        buttons: [
          {
            interactId: 'downloadClicked',
            actionUrl: 'https://nba.com',
            id: '5b4d53f5-45bd-4e5c-a5cb-6e650b1893f6',
            text: {
              content: 'Download App'
            }
          },
          {
            interactId: 'OK',
            id: '5b4d53f5-45bd-4e5c-a5cb-6e650a1993f6',
            text: {
              content: 'OK'
            }
          }
        ],
        dismissBtn: {
          style: 'simple'
        },
        actionUrl: '',
        body: {
          content:
            'Get live scores, real-time updates, and exclusive content right at your fingertips.'
        },
        title: {
          content: 'Stay connected to all the action'
        }
      }
    }
  };
  
  export const SMALL_IMAGE_CONTENT_INVALID_IMAGE: ContentTemplate = {
    id: 'small-image-invalid-image',
    type: 'SmallImage',
    schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
    data: {
      expiryDate: Date.now() + 86400000, // 24 hours from now
      publishedDate: Date.now(),
      contentType: 'application/json',
      meta: {
        adobe: { template: 'SmallImage' as any },
        surface: 'rn/ios/sample'
      },
      content: {
        body: {
          content:
            'Get live scores, real-time updates, and exclusive content right at your fingertips.'
        },
        title: {
          content: 'Stay connected to all the action'
        },
        buttons: [
          {
            interactId: 'buy',
            id: '5b4d53f5-45bd-4e5c-a5cb-6e450b1993f6',
            actionUrl: 'https://nba.com',
            text: {
              content: 'Get Season Pass'
            }
          }
        ],
        actionUrl: '',
        dismissBtn: {
          style: 'circle'
        },
        image: {
          darkUrl: 'https://invalid-dark-url-that-will-fail.png',
          alt: '',
          url: 'https://invalid-light-url-that-will-fail.png'
        }
      }
    }
  };
  
  export const SMALL_IMAGE_CONTENT_IMAGE_DARK_URL: ContentTemplate = {
    id: 'small-image-dark-url',
    type: 'SmallImage',
    schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
    data: {
      expiryDate: Date.now() + 86400000, // 24 hours from now
      publishedDate: Date.now(),
      contentType: 'application/json',
      meta: {
        adobe: { template: 'SmallImage' as any },
        surface: 'rn/ios/sample'
      },
      content: {
        body: {
          content:
            "Tickets are on sale now! Don't miss out on securing your seat to witness the high-flying action from the best players in the game"
        },
        title: {
          content: 'Get Ready for the Basketball Season Kickoff!'
        },
        buttons: [
          {
            interactId: 'buy',
            id: '5b4d53f5-45bd-4e5c-a5cb-6e850b1993f6',
            actionUrl: 'https://nba.com',
            text: {
              content: 'Get Season Pass'
            }
          }
        ],
        actionUrl: '',
        dismissBtn: {
          style: 'circle'
        },
        image: {
          darkUrl:
            'https://hips.hearstapps.com/hmg-prod/images/golden-retriever-dog-royalty-free-image-505534037-1565105327.jpg?crop=0.760xw:1.00xh;0.204xw,0&resize=980:*',
          alt: '',
          url: 'https://cdn.pixabay.com/photo/2022/06/24/06/53/cavalier-king-charles-spaniel-7281121_1280.jpg'
        }
      }
    }
  };
  
  export const SMALL_IMAGE_CONTENT_3_BUTTONS: ContentTemplate = {
    id: 'small-image-3-buttons',
    type: 'SmallImage',
    schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
    data: {
      expiryDate: Date.now() + 86400000, // 24 hours from now
      publishedDate: Date.now(),
      contentType: 'application/json',
      meta: {
        adobe: { template: 'SmallImage' as any },
        surface: 'rn/ios/sample'
      },
      content: {
        body: {
          content:
            "Tickets are on sale now! Don't miss out on securing your seat to witness the high-flying action from the best players in the game"
        },
        title: {
          content: 'Get Ready for the Basketball Season Kickoff!'
        },
        buttons: [
          {
            interactId: 'buy',
            id: '5b4d53f5-45bd-4e5c-a5cb-6e610b1993f6',
            actionUrl: 'https://nba.com',
            text: {
              content: 'Buyyyyy'
            }
          },
          {
            interactId: 'ok',
            id: '5b4d53f5-41bd-4e5c-a5cb-6e650b1993f6',
            actionUrl: 'https://nba.com',
            text: {
              content: 'OK'
            }
          },
          {
            interactId: 'more',
            id: '5b4d53f5-45bd-4e5c-a5cb-6e650b1793f6',
            actionUrl: 'https://nba.com',
            text: {
              content: 'More'
            }
          }
        ],
        actionUrl: '',
        dismissBtn: {
          style: 'circle'
        },
        image: {
          alt: '',
          url: 'https://cdn.pixabay.com/photo/2022/06/24/06/53/cavalier-king-charles-spaniel-7281121_1280.jpg'
        }
      }
    }
  };
  
  export const SMALL_IMAGE_CONTENT_NO_BUTTON: ContentTemplate = {
    id: 'small-image-no-button',
    type: 'SmallImage',
    schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
    data: {
      expiryDate: Date.now() + 86400000, // 24 hours from now
      publishedDate: Date.now(),
      contentType: 'application/json',
      meta: {
        adobe: { template: 'SmallImage' as any },
        surface: 'rn/ios/sample'
      },
      content: {
        body: {
          content:
            "Tickets are on sale now! Don't miss out on securing your seat to witness the high-flying action from the best players in the game"
        },
        title: {
          content: 'Get Ready for the Basketball Season Kickoff!'
        },
        // buttons removed to avoid rendering 0 from `.length &&` in upstream UI
        actionUrl: '',
        dismissBtn: {
          style: 'circle'
        },
        image: {
          alt: '',
          url: 'https://cdn.pixabay.com/photo/2022/06/24/06/53/cavalier-king-charles-spaniel-7281121_1280.jpg'
        }
      }
    }
  };