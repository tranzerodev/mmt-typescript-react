import React from 'react';
import Layout from '../../components/Layout';
import EndpointsPage from './EndpointsPage';
import RouteConfig from '../../portalConfig';

const title = `${RouteConfig.Title} - Endpoints`;

function action() {
  return {
    title,
    chunks: ['endpoints'],
    component: (
      <Layout>
        <EndpointsPage />
      </Layout>
    ),
  };
}

export default action;
