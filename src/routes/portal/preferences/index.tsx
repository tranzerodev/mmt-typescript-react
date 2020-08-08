import React from 'react';
import Layout from '../../../components/Layout';
import Preferences from './Preferences';
import RouteConfig from '../../../portalConfig';

const title = `${RouteConfig.Title} - Preferences`;

function action() {
  return {
    chunks: ['portal-preferences'],
    title,
    component: (
      <Layout>
        <Preferences />
      </Layout>
    ),
  };
}

export default action;
