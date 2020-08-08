if (process.env.BROWSER) {
  throw new Error(
    'Do not import `config.js` from inside the client-side code.',
  );
}

module.exports = {
  // Node.js app
  port: process.env.PORT || 3000,

  // https://expressjs.com/en/guide/behind-proxies.html
  trustProxy: process.env.TRUST_PROXY || 'loopback',

  // API Gateway
  api: {
    // API URL to be used in the client-side code
    clientUrl: process.env.API_CLIENT_URL || '',
    // API URL to be used in the server-side code
    serverUrl:
      process.env.API_SERVER_URL ||
      `http://localhost:${process.env.PORT || 3000}`,
  },

  // Google API
  google: {
    maps: 'AIzaSyBeEpL9aBgB2j8uuAH_yZjRYiK26v9HMIo',
  },

  // Database
  databaseUrl: process.env.DATABASE_URL || 'sqlite:database.sqlite',

  // Web analytics
  analytics: {
    // https://analytics.google.com/
    googleTrackingId: process.env.GOOGLE_TRACKING_ID, // UA-XXXXX-X
  },

  isProd:
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging',

  appName: 'Lightout',

  stripe: {
    secretKey: '', // initialized via aws ssm
    publishableKey: '', // initialized via aws ssm
    clientId: '', // initialized via aws ssm
    authorizeUri: 'https://connect.stripe.com/express/oauth/authorize',
    tokenUri: 'https://connect.stripe.com/oauth/token',
  },

  frontPluginKey: '20c07b4c2f9b0b13',
};
