import React from 'react';
import BrowserUnsupportedPage from './BrowserUnsupportedPage';
import RouteConfig from '../../portalConfig';

const title = `${RouteConfig.Title} - Browser Unsupported`;

function action() {
  return {
    title,
    component: <BrowserUnsupportedPage />,
  };
}

export default action;
