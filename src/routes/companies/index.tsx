import React from 'react';
import Layout from '../../components/Layout';
import CompaniesPage from './CompaniesPage';
import RouteConfig from '../../portalConfig';

const title = `${RouteConfig.Title} - Companies`;

function action() {
  return {
    chunks: ['companies'],
    title,
    component: (
      <Layout>
        <CompaniesPage />
      </Layout>
    ),
  };
}

export default action;
