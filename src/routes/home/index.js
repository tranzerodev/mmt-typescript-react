import React from 'react';
import Layout from '../../components/Layout';
import Home from './Home';
import RouteConfig from '../../portalConfig';

const title = RouteConfig.Title;

function action() {
  return {
    chunks: ['home'],
    title,
    component: (
      <Layout>
        <Home />
      </Layout>
    ),
  };
}

export default action;
