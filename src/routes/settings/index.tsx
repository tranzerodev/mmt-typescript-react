import React from 'react';
import RouteConfig from '../../portalConfig';
import { SettingsLayout } from './SettingsLayout';
/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
import Layout from '../../components/Layout';

const title = `${RouteConfig.Title} - Settings`;

function action() {
  return {
    chunks: ['settings'],
    title,
    component: (
      <Layout>
        <SettingsLayout />
      </Layout>
    ),
  };
}

export default action;
