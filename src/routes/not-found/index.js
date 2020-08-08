import React from 'react';
import UnAuthLayout from '../../components/Layout/UnAuthLayout';
import NotFound from './NotFound';

const title = 'Page Not Found';

function action() {
  return {
    chunks: ['not-found'],
    title,
    component: (
      <UnAuthLayout>
        <NotFound title={title} />
      </UnAuthLayout>
    ),
    status: 404,
  };
}

export default action;
