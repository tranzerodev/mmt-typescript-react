import React from 'react';
import ErrorPage from './ErrorPage';
import RouteConfig from '../../portalConfig';

const title = `${RouteConfig.Title} - Error`;

function action() {
  return {
    title,
    component: <ErrorPage />,
  };
}

export default action;
