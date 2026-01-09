import { ContentTemplate } from "@adobe/react-native-aepmessaging";

// Large Image Templates
export const LARGE_IMAGE_CONTENT_ALL_FIELDS: ContentTemplate = {
    id: 'large-image-all-fields',
    type: 'LargeImage',
    schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
    data: {
      expiryDate: Date.now() + 86400000, // 24 hours from now
      publishedDate: Date.now(),
      contentType: 'application/json',
      meta: {
        adobe: { template: 'LargeImage' as any },
        surface: 'rn/ios/sample'
      },
      content: {
        actionUrl: 'https://cardaction.com',
        body: {
          content:
            "Tickets are on sale now! Don't miss out on securing your seat to witness the high-flying action from the best players in the game"
        },
        buttons: [
          {
            id: 'a41d1bff-2797-4958-a6d7-2b367e0554595',
            actionUrl: 'https://buttonone.com/action',
            interactId: 'buttonOneClicked',
            text: {
              content: 'ButtonTextOne'
            }
          }
        ],
        image: {
          alt: '',
          url: 'https://cdn.pixabay.com/photo/2022/06/24/06/53/cavalier-king-charles-spaniel-7281121_1280.jpg',
          darkUrl: ''
        },
        dismissBtn: {
          style: 'simple'
        },
        title: {
          content: 'This is large image title'
        }
      }
    }
  };
  
  export const LARGE_IMAGE_CONTENT_3_BUTTONS: ContentTemplate = {
    id: 'large-image-3-buttons',
    type: 'LargeImage',
    schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
    data: {
      expiryDate: Date.now() + 86400000, // 24 hours from now
      publishedDate: Date.now(),
      contentType: 'application/json',
      meta: {
        adobe: { template: 'LargeImage' as any },
        surface: 'rn/ios/sample'
      },
      content: {
        actionUrl: 'https://cardaction.com',
        body: {
          content:
            "Tickets are on sale now! Don't miss out on securing your seat to witness the high-flying action from the best players in the game"
        },
        buttons: [
          {
            id: 'a41d1bff-2797-4958-a6d7-2b367e035795',
            actionUrl: 'https://buttonone.com/action',
            interactId: 'buttonOneClicked_1',
            text: {
              content: 'ButtonOne'
            }
          },
          {
            id: 'a41d1bff-2797-4958-a6d7-2b367e055796',
            interactId: 'buttonOneClicked_2',
            text: {
              content: 'ButtonTwo'
            }
          },
          {
            id: 'a41d1bff-2797-4958-a6d7-2b367e055797',
            interactId: 'buttonOneClicked_3',
            text: {
              content: 'ButtonThreeeeeeeee'
            }
          }
        ],
        image: {
          alt: '',
          url: 'https://cdn.pixabay.com/photo/2022/06/24/06/53/cavalier-king-charles-spaniel-7281121_1280.jpg'
        },
        dismissBtn: {
          style: 'simple'
        },
        title: {
          content: 'This is large image title'
        }
      }
    }
  };
  
  export const LARGE_IMAGE_CONTENT_NO_DISMISS_BUTTON: ContentTemplate = {
    id: 'large-image-no-dismiss',
    type: 'LargeImage',
    schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
    data: {
      expiryDate: Date.now() + 86400000, // 24 hours from now
      publishedDate: Date.now(),
      contentType: 'application/json',
      meta: {
        adobe: { template: 'LargeImage' as any },
        surface: 'rn/ios/sample'
      },
      content: {
        actionUrl: 'https://cardaction.com',
        body: {
          content:
            "Tickets are on sale now! Don't miss out on securing your seat to witness the high-flying action from the best players in the game"
        },
        buttons: [
          {
            id: 'a41d1bff-2797-4958-a6d7-2b367e055798',
            actionUrl: 'https://buttonone.com/action',
            interactId: 'buttonOneClicked',
            text: {
              content: 'ButtonTextOne'
            }
          }
        ],
        image: {
          alt: '',
          url: 'https://cdn.pixabay.com/photo/2022/06/24/06/53/cavalier-king-charles-spaniel-7281121_1280.jpg'
        },
        dismissBtn: {
          style: 'none'
        },
        title: {
          content: 'This is large image title'
        }
      }
    }
  };
  
  export const LARGE_IMAGE_CONTENT_INVALID_IMAGE: ContentTemplate = {
    id: 'large-image-invalid',
    type: 'LargeImage',
    schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
    data: {
      expiryDate: Date.now() + 86400000, // 24 hours from now
      publishedDate: Date.now(),
      contentType: 'application/json',
      meta: {
        adobe: { template: 'LargeImage' as any },
        surface: 'rn/ios/sample'
      },
      content: {
        actionUrl: 'https://cardaction.com',
        body: {
          content:
            "Tickets are on sale now! Don't miss out on securing your seat to witness the high-flying action from the best players in the game"
        },
        buttons: [
          {
            id: 'a41d1bff-2797-4958-a6d7-2b365e055795',
            actionUrl: 'https://buttonone.com/action',
            interactId: 'buttonOneClicked',
            text: {
              content: 'ButtonTextOne'
            }
          }
        ],
        image: {
          alt: '',
          url: 'https://xxx',
          darkUrl: 'https://imageurl.com/dark'
        },
        dismissBtn: {
          style: 'none'
        },
        title: {
          content: 'This is large image title'
        }
      }
    }
  };
  
  export const LARGE_IMAGE_CONTENT_DARK_URL: ContentTemplate = {
    id: 'large-image-dark-url',
    type: 'LargeImage',
    schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
    data: {
      expiryDate: Date.now() + 86400000, // 24 hours from now
      publishedDate: Date.now(),
      contentType: 'application/json',
      meta: {
        adobe: { template: 'LargeImage' as any },
        surface: 'rn/ios/sample'
      },
      content: {
        actionUrl: 'https://cardaction.com',
        body: {
          content:
            "Tickets are on sale now! Don't miss out on securing your seat to witness the high-flying action from the best players in the game"
        },
        buttons: [
          {
            id: 'a41d1bff-2797-4958-a6d7-2b367e055745',
            actionUrl: 'https://buttonone.com/action',
            interactId: 'buttonOneClicked',
            text: {
              content: 'ButtonTextOne'
            }
          }
        ],
        image: {
          alt: '',
          url: 'https://cdn.pixabay.com/photo/2022/06/24/06/53/cavalier-king-charles-spaniel-7281121_1280.jpg',
          darkUrl:
            'https://hips.hearstapps.com/hmg-prod/images/golden-retriever-dog-royalty-free-image-505534037-1565105327.jpg?crop=0.760xw:1.00xh;0.204xw,0&resize=980:*'
        },
        dismissBtn: {
          style: 'none'
        },
        title: {
          content: 'This is large image title'
        }
      }
    }
  };
  
  export const LARGE_IMAGE_CONTENT_LONG_TITLE: ContentTemplate = {
    id: 'large-image-long-title',
    type: 'LargeImage',
    schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
    data: {
      expiryDate: Date.now() + 86400000, // 24 hours from now
      publishedDate: Date.now(),
      contentType: 'application/json',
      meta: {
        adobe: { template: 'LargeImage' as any },
        surface: 'rn/ios/sample'
      },
      content: {
        actionUrl: 'https://cardaction.com',
        body: {
          content:
            "Tickets are on sale now! Don't miss out on securing your seat to witness the high-flying action from the best players in the game"
        },
        buttons: [
          {
            id: 'a41d1bff-2797-4958-a6d7-2b367e055748',
            actionUrl: 'https://buttonone.com/action',
            interactId: 'buttonOneClicked',
            text: {
              content: 'ButtonTextOne'
            }
          }
        ],
        image: {
          alt: '',
          url: 'https://cdn.pixabay.com/photo/2022/06/24/06/53/cavalier-king-charles-spaniel-7281121_1280.jpg',
          darkUrl:
            'https://hips.hearstapps.com/hmg-prod/images/golden-retriever-dog-royalty-free-image-505534037-1565105327.jpg?crop=0.760xw:1.00xh;0.204xw,0&resize=980:*'
        },
        dismissBtn: {
          style: 'none'
        },
        title: {
          content:
            "This is large image title, it's very long very long very long very long"
        }
      }
    }
  };