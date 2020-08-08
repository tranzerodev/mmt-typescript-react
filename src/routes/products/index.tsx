import React from 'react';
import Layout from '../../components/Layout';
import ProductsPage from './ProductsPage';
import RouteConfig from '../../portalConfig';

const title = `${RouteConfig.Title} - Products`;

function action() {
  return {
    title,
    chunks: ['products'],
    component: (
      <Layout>
        <ProductsPage />
      </Layout>
    ),
  };
}

export default action;
