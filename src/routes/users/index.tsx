import React from 'react';
import Layout from '../../components/Layout/Layout';
import ClientsPage from './ClientsPage';
import RouteConfig from '../../portalConfig';

const title = `${RouteConfig.Title} - Clients`;

function action() {
  return {
    chunks: ['users'],
    title,
    component: (
      <Layout>
        <ClientsPage />
      </Layout>
    ),
  };
}

export default action;
