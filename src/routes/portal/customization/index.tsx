import React from 'react';
import Layout from '../../../components/Layout';
import CustomizationPage from './CustomizationPage';
import RouteConfig from '../../../portalConfig';

const title = `${RouteConfig.Title} - Customization`;

function action() {
  return {
    chunks: ['portal-customization'],
    title,
    component: (
      <Layout>
        <CustomizationPage />
      </Layout>
    ),
  };
}

export default action;
