const path = require('path');

const issue599Packages = {
  '@adobe/react-native-aepcore': 'core',
  '@adobe/react-native-aepedge': 'edge',
  '@adobe/react-native-aepedgeidentity': 'edgeidentity',
  '@adobe/react-native-aepuserprofile': 'userprofile',
};

const dependencies =
  process.env.AEP_ISSUE_599_REPRO === 'true'
    ? Object.fromEntries(
        Object.keys(require('./package.json').dependencies).map(name => [
          name,
          issue599Packages[name]
            ? {
                root: path.resolve(
                  __dirname,
                  '../../packages',
                  issue599Packages[name],
                ),
              }
            : {platforms: {android: null}},
        ]),
      )
    : {};

if (process.env.AEP_ISSUE_599_REPRO === 'all') {
  const allAdobePackages = {
    ...issue599Packages,
    '@adobe/react-native-aepassurance': 'assurance',
    '@adobe/react-native-aepcampaignclassic': 'campaignclassic',
    '@adobe/react-native-aepedgebridge': 'edgebridge',
    '@adobe/react-native-aepedgeconsent': 'edgeconsent',
    '@adobe/react-native-aepmessaging': 'messaging',
    '@adobe/react-native-aepoptimize': 'optimize',
    '@adobe/react-native-aepplaces': 'places',
    '@adobe/react-native-aeptarget': 'target',
  };
  for (const [name, directory] of Object.entries(allAdobePackages)) {
    dependencies[name] = {
      root: path.resolve(__dirname, '../../packages', directory),
    };
  }
}

module.exports = {
  dependencies,
  project: {
    ios: {},
    android: {},
  },
};
