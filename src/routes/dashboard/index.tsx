import React from 'react';
import DashboardPage from './DashboardPage';
import Layout from '../../components/Layout';
import RouteConfig from '../../portalConfig';

const title = `${RouteConfig.Title} - Dashboard`;

async function action() {
  return {
    title,
    chunks: ['dashboard'],
    component: (
      <Layout>
        <DashboardPage />
      </Layout>
    ),
  };
}

export default action;
