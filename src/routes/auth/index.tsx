import React from 'react';
import { Box } from '@material-ui/core';
import RouteConfig from '../../portalConfig';
import AuthLayout from './AuthLayout';

const title = `${RouteConfig.Title} - Login`;

function action() {
  return {
    chunks: ['login'],
    title,
    component: (
      <Box>
        <AuthLayout />
      </Box>
    ),
  };
}

export default action;
