export const mockSettings = {
  'mock/vertical': {
    surfaceSettings: {
      content: {
        heading: { content: 'Vertical' },
        layout: { orientation: 'vertical' },
        capacity: 15,
        emptyStateSettings: { message: { content: 'Error loading inbox' } },
        isUnreadEnabled: true,
      },
      showPagination: false,
    }
  },
  'mock/horizontal': {
    surfaceSettings: {
      content: {
        heading: { content: 'Horizontal' },
        layout: { orientation: 'horizontal' },
        capacity: 15,
        emptyStateSettings: { message: { content: 'Error loading carousel' } },
        isUnreadEnabled: false,
      },
      showPagination: false,
    }
  },
  'mock/empty': {
    surfaceSettings: {
      content: {
        heading: { content: 'Empty' },
        layout: { orientation: 'vertical' },
        capacity: 0,
        emptyStateSettings: {
          message: {
            content: "No deals today come back soon!",
          },
          image: {
            url: "https://cdn-icons-png.flaticon.com/512/6134/6134065.png",
            darkUrl: "https://cdni.iconscout.com/illustration/premium/thumb/not-found-error-illustration-svg-download-png-9824391.png",
          }
        },
        isUnreadEnabled: true,
      },
    },
  },
  'mock/inbox-with-styling': {
    surfaceSettings: {
      content: {
        heading: { content: 'Inbox with Styling' },
        layout: { orientation: 'vertical' },
        capacity: 10,
        emptyStateSettings: { message: { content: 'Error loading inbox with styling' } },
        unread_indicator: {
          unread_bg: {
            clr: {
              light: "#dcfbd8",
              dark: "#14532D",   
            },
          },
          
        },
        isUnreadEnabled: true,
      },
      showPagination: false,
    },
    inboxStyle: {
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
    }
  },
  'mock/custom-card-view': {
    surfaceSettings: {
      content: {
        heading: { content: 'Custom Card View' },
        layout: { orientation: 'horizontal' },
        capacity: 10,
        emptyStateSettings: { message: { content: 'Error loading custom card view' } },
        isUnreadEnabled: true,
        unread_indicator: {
          unread_icon: {
            placement: "bottomright",
            image: {
              url: "https://icons.veryicon.com/png/o/leisure/crisp-app-icon-library-v3/notification-5.png",
              darkUrl: "",
            },
          },
        },
      },
      showPagination: false,
    },
    CardProps: {
      BodyProps: { numberOfLines: 2, ellipsizeMode: 'tail' },
      styleOverrides: {
        largeImageStyle: {
          container: { height: 250, alignItems: 'center', backgroundColor: '#ADD8E6', borderRadius: 12, padding: 10 },
          imageContainer: { width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ADD8E6' },
          image: { width: 140, height: 90, resizeMode: 'cover', alignSelf: 'center', borderRadius: 12 },
          contentContainer: { alignSelf: 'stretch', alignItems: 'flex-start' },
        },
        smallImageStyle: {
          container: { height: 250, flexDirection: 'row', backgroundColor: '#ADD8E6', borderRadius: 12, alignItems: 'center', padding: 10 },
        },
        imageOnlyStyle: {
          imageContainer: { backgroundColor: '#ADD8E6', height: 250, alignItems: 'center', justifyContent: 'center'},
        },
      },
    },
    containerStyle: { height: 250 },
  },
}

export type MockSurface = keyof typeof mockSettings;