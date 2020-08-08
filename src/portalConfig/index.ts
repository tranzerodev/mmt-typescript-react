/* eslint-disable */
import config from './portalConfig.json';

config.assets.faviconUrl = config.assets.faviconUrl || '/favicon.ico';

config.features = config.features || {};

config.assets.logoStyle = config.assets.logoStyle || {
  filter: 'brightness(0) invert(1)',
  height: '35px',
};

const defaultAuthImage = '/images/auth_image.png';
config.assets.authImage = config.assets.authImage || {
  signInUrl: defaultAuthImage,
  signInStyle: {},
  signUpUrl: defaultAuthImage,
  signUpStyle: {},
};

config.assets.authImage.signInUrl =
  config.assets.authImage.signInUrl || defaultAuthImage;
config.assets.authImage.signUpUrl =
  config.assets.authImage.signUpUrl || defaultAuthImage;

const defaultFavicon =
  'https://lightout-portal.s3-us-west-2.amazonaws.com/public/lightout/favicon.ico';
config.assets.faviconUrl = config.assets.faviconUrl || defaultFavicon;

config.BaseAPIUrl = config.AWS.API.endpoints[0].endpoint;

config.AWS.API.endpoints[0].custom_header = () => ({
  Portal: config.portalHeader,
});

// do not use constants variable here to skip circular ref.
config.businessMode = config.businessMode || 'b2b';

export default config;
