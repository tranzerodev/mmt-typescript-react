import React from 'react';
// TODO: remove ts-ignore after components/Layout.js will be converted into Layout.ts
/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
import Layout from '../../components/Layout';
import PackagesFeed from './PackagesFeed';
import RouteConfig from '../../portalConfig';

const title = `${RouteConfig.Title} - Packages`;

function action({ query }: any) {
  return {
    chunks: ['packages'],
    title,
    component: (
      <Layout>
        <PackagesFeed {...query} />
      </Layout>
    ),
  };
}

export default action;
