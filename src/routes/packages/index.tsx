import React from 'react';
import Layout from '../../components/Layout';
import PackagesPage from './PackagesPage';
import RouteConfig from '../../portalConfig';

const title = `${RouteConfig.Title} - Packages`;

function action() {
  return {
    chunks: ['packages'],
    title,
    component: (
      <Layout>
        <PackagesPage />
      </Layout>
    ),
  };
}

export default action;
