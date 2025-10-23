export const mockSettings = {
    'mock/inbox': {
      templateType: 'inbox',
      content: {
        heading: { content: 'Inbox' },
        layout: { orientation: 'vertical' },
        capacity: 10,
        emptyStateSettings: { message: { content: 'Error loading inbox' } },
        isUnreadEnabled: true,
      },
      showPagination: false,
    },
    'mock/carousel': {
      templateType: 'inbox',
      content: {
        heading: { content: 'Carousel' },
        layout: { orientation: 'horizontal' },
        capacity: 10,
        emptyStateSettings: { message: { content: 'Error loading carousel' } },
        isUnreadEnabled: true,
      },
      showPagination: false,
    },
    'mock/empty': {
      templateType: 'inbox',
      content: {
        heading: { content: 'Empty' },
        layout: { orientation: 'vertical' },
        capacity: 10,
        emptyStateSettings: {
            message: {
             content: "No deals today come back soon!",
            },
            image: {
             light: { url: "https://icons.veryicon.com/png/o/leisure/crisp-app-icon-library-v3/notification-5.png" },
             darkUrl: "https://imagetoDownload.com/darkemptyimage",
            }
         },
        isUnreadEnabled: true,
      },
    },
    'mock/custom-card-view': {
      templateType: 'inbox',
      content: {
        heading: { content: 'Custom Card View' },
        layout: { orientation: 'vertical' },
        capacity: 10,
        emptyStateSettings: { message: { content: 'Error loading custom card view' } },
        isUnreadEnabled: true,
      },
    },
  } as const;

export const mockContainerUIProps = {
  'mock/container-with-styling': {
      rowGap: 12,
      alignItems: 'stretch',
      backgroundColor: '#FDF2F8',
      borderRadius: 18,
      borderWidth: 2,
      borderColor: '#F0ABFC',
      shadowColor: '#F472B6',
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 6,
      margin: 10,
  },
  'mock/custom-card-view': {
    CardProps: {
      BodyProps: { numberOfLines: 2, ellipsizeMode: 'tail' },
      styleOverrides: {
        largeImageStyle: {
          container: { height: 200, alignItems: 'center', backgroundColor: '#ADD8E6', borderRadius: 12 },
          imageContainer: { width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ADD8E6' },
          image: { width: 140, height: 90, resizeMode: 'cover', alignSelf: 'center', borderRadius: 12 },
          contentContainer: { alignSelf: 'stretch', alignItems: 'flex-start' },
        },
        smallImageStyle: {
          container: { height: 200, flexDirection: 'row', backgroundColor: '#ADD8E6', borderRadius: 12, alignItems: 'center', padding: 8 },
        },
        imageOnlyStyle: {
          imageContainer: { height: 200, backgroundColor: '#ADD8E6' },
          image: { borderRadius: 12, height: 200 },
        },
      },
    },
    contentContainerStyle: { height: 200 },
  },
} as const;