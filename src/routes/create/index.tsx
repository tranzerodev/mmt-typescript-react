import React from 'react';
import Layout from '../../components/Layout';
import CreatePage from './CreatePage';
import RouteConfig from '../../portalConfig';

const title = `${RouteConfig.Title} - Create`;

function action() {
  return {
    chunks: ['create'],
    title,
    component: (
      <Layout theme="dark">
        <CreatePage />
      </Layout>
    ),
  };
}

export default action;
