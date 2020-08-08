import React from 'react';
import Layout from '../../components/Layout';
import PackagePage from './PackagePage';
import RouteConfig from '../../portalConfig';

const title = `${RouteConfig.Title} - Package`;

function action() {
  return {
    chunks: ['package'],
    title,
    component: (
      <Layout theme="dark">
        <PackagePage />
      </Layout>
    ),
  };
}

export default action;
