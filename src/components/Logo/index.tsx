/* eslint-disable import/no-unresolved */
/* eslint-disable global-require */
import React from 'react';
import portalConfig from '../../portalConfig';

const configLogoObj = portalConfig.assets.logoMark;
let imageUrl = configLogoObj.svgUrl;
if (!imageUrl) {
  imageUrl = configLogoObj.pngUrl;
}

const Logo: React.SFC = () => (
  <img src={imageUrl} alt="Logo" style={portalConfig.assets.logoStyle} />
);

export default Logo;
