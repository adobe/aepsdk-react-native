import { ContentTemplate } from "@adobe/react-native-aepmessaging";

// Image Only Templates
export const IMAGE_ONLY_CONTENT_ALL_FIELDS: ContentTemplate = {
    id: 'image-only-all-fields',
    type: 'ImageOnly',
    schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
    data: {
      expiryDate: Date.now() + 86400000, // 24 hours from now
      publishedDate: Date.now(),
      contentType: 'application/json',
      meta: {
        adobe: { template: 'ImageOnly' as any },
        surface: 'rn/ios/sample'
      },
      content: {
        actionUrl: 'https://www.adobe.com/',
        image: {
          url: 'https://t4.ftcdn.net/jpg/13/35/40/27/240_F_1335402728_gCAPzivq5VytTJVCEcfIB2eX3ZCdE8cc.jpg',
          darkUrl:
            'https://hips.hearstapps.com/hmg-prod/images/golden-retriever-dog-royalty-free-image-505534037-1565105327.jpg',
          alt: 'flight offer'
        },
        dismissBtn: {
          style: 'simple'
        }
      }
    }
  };
  
  export const IMAGE_ONLY_CONTENT_WITH_ACTION_URL: ContentTemplate = {
    id: 'image-only-with-action-url',
    type: 'ImageOnly',
    schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
    data: {
      expiryDate: Date.now() + 86400000, // 24 hours from now
      publishedDate: Date.now(),
      contentType: 'application/json',
      meta: {
        adobe: { template: 'ImageOnly' as any },
        surface: 'rn/ios/sample'
      },
      content: {
        actionUrl: 'https://google.com',
        image: {
          url: 'https://t4.ftcdn.net/jpg/13/35/40/27/240_F_1335402728_gCAPzivq5VytTJVCEcfIB2eX3ZCdE8cc.jpg',
          darkUrl:
            'https://hips.hearstapps.com/hmg-prod/images/golden-retriever-dog-royalty-free-image-505534037-1565105327.jpg?crop=0.760xw:1.00xh;0.204xw,0&resize=980:*',
          alt: 'with action URL - Google Images'
        },
        dismissBtn: {
          style: 'simple'
        }
      }
    }
  };
  
  export const IMAGE_ONLY_CONTENT_DISMISS_BUTTON_CIRCLE: ContentTemplate = {
    id: 'image-only-dismiss-circle',
    type: 'ImageOnly',
    schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
    data: {
      expiryDate: Date.now() + 86400000, // 24 hours from now
      publishedDate: Date.now(),
      contentType: 'application/json',
      meta: {
        adobe: { template: 'ImageOnly' as any },
        surface: 'rn/ios/sample'
      },
      content: {
        actionUrl: 'https://google.com',
        image: {
          url: 'https://i.ibb.co/0X8R3TG/Messages-24.png',
          darkUrl:
            'https://hips.hearstapps.com/hmg-prod/images/golden-retriever-dog-royalty-free-image-505534037-1565105327.jpg?crop=0.760xw:1.00xh;0.204xw,0&resize=980:*',
          alt: 'flight offer'
        },
        dismissBtn: {
          style: 'circle'
        }
      }
    }
  };
  
  export const IMAGE_ONLY_CONTENT_NO_DISMISS_BUTTON: ContentTemplate = {
    id: 'image-only-no-dismiss',
    type: 'ImageOnly',
    schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
    data: {
      expiryDate: Date.now() + 86400000, // 24 hours from now
      publishedDate: Date.now(),
      contentType: 'application/json',
      meta: {
        adobe: { template: 'ImageOnly' as any },
        surface: 'rn/ios/sample'
      },
      content: {
        actionUrl: 'https://google.com',
        image: {
          url: 'https://cdn.pixabay.com/photo/2022/06/24/06/53/cavalier-king-charles-spaniel-7281121_1280.jpg',
          darkUrl:
            'https://hips.hearstapps.com/hmg-prod/images/golden-retriever-dog-royalty-free-image-505534037-1565105327.jpg',
          alt: 'flight offer'
        }
      }
    }
  };
  
  export const IMAGE_ONLY_CONTENT_INVALID_IMAGE: ContentTemplate = {
    id: 'image-only-invalid-image',
    type: 'ImageOnly',
    schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
    data: {
      expiryDate: Date.now() + 86400000, // 24 hours from now
      publishedDate: Date.now(),
      contentType: 'application/json',
      meta: {
        adobe: { template: 'ImageOnly' as any },
        surface: 'rn/ios/sample'
      },
      content: {
        actionUrl: 'https://google.com',
        image: {
          url: 'https://invalid-url-that-will-fail',
          darkUrl: 'https://another-invalid-url',
          alt: 'broken image'
        },
        dismissBtn: {
          style: 'simple'
        }
      }
    }
  };
  
  export const IMAGE_ONLY_CONTENT_NO_ACTION: ContentTemplate = {
    id: 'image-only-no-action',
    type: 'ImageOnly',
    schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
    data: {
      expiryDate: Date.now() + 86400000, // 24 hours from now
      publishedDate: Date.now(),
      contentType: 'application/json',
      meta: {
        adobe: { template: 'ImageOnly' as any },
        surface: 'rn/ios/sample'
      },
      content: {
        image: {
          url: 'https://cdn.pixabay.com/photo/2022/06/24/06/53/cavalier-king-charles-spaniel-7281121_1280.jpg',
          darkUrl:
            'https://hips.hearstapps.com/hmg-prod/images/golden-retriever-dog-royalty-free-image-505534037-1565105327.jpg',
          alt: 'non-clickable image'
        },
        dismissBtn: {
          style: 'simple'
        }
      }
    }
  };
  
  export const IMAGE_ONLY_CONTENT_NO_DARK_URL: ContentTemplate = {
    id: 'image-only-no-dark-url',
    type: 'ImageOnly',
    schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
    data: {
      expiryDate: Date.now() + 86400000, // 24 hours from now
      publishedDate: Date.now(),
      contentType: 'application/json',
      meta: {
        adobe: { template: 'ImageOnly' as any },
        surface: 'rn/ios/sample'
      },
      content: {
        actionUrl: 'https://google.com',
        image: {
          url: 'https://cdn-icons-png.flaticon.com/256/3303/3303838.png',
          alt: 'light mode only image'
        },
        dismissBtn: {
          style: 'simple'
        }
      }
    }
  };
  
  export const IMAGE_ONLY_CONTENT_NO_LIGHT_MODE: ContentTemplate = {
    id: 'image-only-different-image',
    type: 'ImageOnly',
    schema: 'https://ns.adobe.com/personalization/message/content-card' as any,
    data: {
      expiryDate: Date.now() + 86400000, // 24 hours from now
      publishedDate: Date.now(),
      contentType: 'application/json',
      meta: {
        adobe: { template: 'ImageOnly' as any },
        surface: 'rn/ios/sample'
      },
      content: {
        image: {
          url: '',
          darkUrl:
            'https://hips.hearstapps.com/hmg-prod/images/golden-retriever-dog-royalty-free-image-505534037-1565105327.jpg?crop=0.760xw:1.00xh;0.204xw,0&resize=980:*',
          alt: 'basketball icon'
        },
        dismissBtn: {
          style: 'circle'
        }
      }
    }
  } as ContentTemplate;