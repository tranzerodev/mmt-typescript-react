import React from 'react';
import DriverActive from './DriverActive';
import UnAuthLayout from '../../components/Layout/UnAuthLayout';
import RouteConfig from '../../portalConfig';

const title = `${RouteConfig.Title} - Drivers`;

async function action({ query }) {
  return {
    title,
    chunks: ['drivers'],
    component: (
      <UnAuthLayout>
        <DriverActive isActive={query.success === 'true'} />
      </UnAuthLayout>
    ),
  };
}

export default action;
