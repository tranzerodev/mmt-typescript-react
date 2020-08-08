import React from 'react';
import RouteConfig from '../../portalConfig';
import { FilesLayout } from './FilesLayout';
/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
import Layout from '../../components/Layout';

const title = `${RouteConfig.Title} - Files`;

function action() {
  return {
    chunks: ['files'],
    title,
    component: (
      <Layout>
        <FilesLayout />
      </Layout>
    ),
  };
}

export default action;
