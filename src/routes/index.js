/* eslint-disable global-require */
// The top-level (parent) route
const routes = {
  path: '',

  // Keep in mind, routes are evaluated in order
  children: [
    {
      path: '',
      load: () => import(/* webpackChunkName: 'home' */ './home'),
    },
    {
      path: '/create',
      load: () => import(/* webpackChunkName: 'create' */ './create'),
    },
    {
      path: '/dashboard',
      load: () => import(/* webpackChunkName: 'dashboard' */ './dashboard'),
    },
    {
      path: '/endpoints',
      load: () => import(/* webpackChunkName: 'endpoints' */ './endpoints'),
    },
    {
      path: '/moving-endpoints',
      load: () =>
        import(/* webpackChunkName: 'moving-endpoints' */ './moving-endpoints'),
    },
    {
      path: '/products',
      load: () => import(/* webpackChunkName: 'products' */ './products'),
    },
    {
      path: '/packages',
      load: () => import(/* webpackChunkName: 'packages' */ './packages'),
    },
    {
      path: '/package',
      load: () => import(/* webpackChunkName: 'package' */ './package'),
    },
    {
      path: '/drivers/activate',
      load: () => import(/* webpackChunkName: 'drivers' */ './drivers'),
    },
    {
      path: '/clients',
      children: [
        {
          path: '/companies',
          load: () => import(/* webpackChunkName: 'companies' */ './companies'),
        },
        {
          path: '/users',
          load: () => import(/* webpackChunkName: 'users' */ './users'),
        },
      ],
    },
    {
      path: '/portal',
      children: [
        {
          path: '/customization',
          load: () =>
            import(/* webpackChunkName: 'portal-customization' */ './portal/customization'),
        },
        {
          path: '/preferences',
          load: () =>
            import(/* webpackChunkName: 'portal-preferences' */ './portal/preferences'),
        },
      ],
    },
    {
      path: '/login',
      load: () => import(/* webpackChunkName: 'login' */ './auth'),
    },
    {
      path: '/browser-unsupported',
      load: () =>
        import(/* webpackChunkName: 'browser-unsuported' */ './browser-unsupported'),
    },
    {
      path: '/settings',
      load: () => import(/* webpackChunkName: 'settings' */ './settings'),
    },
    {
      path: '/resources',
      load: () => import(/* webpackChunkName: 'resources' */ './resources'),
    },
    {
      path: '/feed',
      load: () => import(/* webpackChunkName: 'packages' */ './package-feeds'),
    },
    {
      path: '/files',
      load: () => import(/* webpackChunkName: 'files' */ './files'),
    },

    // Wildcard routes, e.g. { path: '(.*)', ... } (must go last)
    {
      path: '(.*)',
      load: () => import(/* webpackChunkName: 'not-found' */ './not-found'),
    },
  ],

  async action({ next }) {
    // Execute each child route until one of them return the result
    const route = await next();

    // Provide default values for title, description etc.
    route.title = `${route.title || 'Untitled Page'}`;
    route.description = route.description || '';

    return route;
  },
};

// The error page is available by permanent url for development mode
if (__DEV__) {
  routes.children.unshift({
    path: '/error',
    action: require('./error').default,
  });
}

export default routes;
