import PropTypes from 'prop-types';

export const screenTypePropType = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  videoSupported: PropTypes.bool,
  spotLength: PropTypes.arrayOf(PropTypes.string),
  screenCountHorizontal: PropTypes.number,
  screenCountVertical: PropTypes.number,
  resolutionHeight: PropTypes.number,
  resolutionWidth: PropTypes.number,
  loopLength: PropTypes.number,
  dimensionHeight: PropTypes.number,
  dimensionWidth: PropTypes.number,
  pixelGapHorizontal: PropTypes.number,
  pixelGapVertical: PropTypes.number,
});

export const publicImageUrl = `
https://s3-us-west-2.amazonaws.com/ridebill-userfiles-mobilehub-310871815/
public/unauth/creatives/Cola+Ad.png
`;

export const publicVideoUrl = `
https://s3-us-west-2.amazonaws.com/ridebill-userfiles-mobilehub-310871815/
public/unauth/creatives/cola.mp4
`;

export const publicKeyCreativeUrls = {
  'unauth/creatives/Cola Ad.png': publicImageUrl.replace(/\s/g, ''),
  'unauth/creatives/cola.mp4': publicVideoUrl.replace(/\s/g, ''),
};
