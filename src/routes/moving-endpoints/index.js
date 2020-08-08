import React from 'react';
import MovingEndpoints from './moving-endpoints';
import Layout from '../../components/Layout/Layout';
import RouteConfig from '../../portalConfig';

const title = `${RouteConfig.Title} - Moving Endpoints`;

async function action({ query }) {
  return {
    title,
    chunks: ['moving-endpoints'],
    component: (
      <Layout>
        <MovingEndpoints {...query} />
      </Layout>
    ),
  };
}

export default action;
