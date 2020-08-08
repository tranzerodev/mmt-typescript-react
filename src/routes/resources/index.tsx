import React from 'react';
import Layout from '../../components/Layout';
import ResourcesPage from './ResourcesPage';
import RouteConfig from '../../portalConfig';

const title = `${RouteConfig.Title} - Resources`;

function action() {
  return {
    chunks: ['resources'],
    title,
    component: (
      <Layout>
        <ResourcesPage />
      </Layout>
    ),
  };
}

export default action;
