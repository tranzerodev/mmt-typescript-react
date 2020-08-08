import React from 'react';
import ArrowBackIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIcon from '@material-ui/icons/ArrowForwardIos';

export const ArrowLeft = () => (
  <ArrowBackIcon
    style={{
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      left: 0,
    }}
  />
);

export const ArrowRight = () => (
  <ArrowForwardIcon
    style={{
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      right: 0,
    }}
  />
);
