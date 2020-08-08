import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressGraphQL from 'express-graphql';
import React from 'react';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import isMobile from 'is-mobile';
import { ServerStyleSheets, ThemeProvider } from '@material-ui/core/styles';
import App from './components/App';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import BrowserUnsupportedPage from './routes/browser-unsupported/BrowserUnsupportedPage';
import router from './router';
import schema from './data/schema';
// import assets from './asset-manifest.json'; // eslint-disable-line import/no-unresolved
import chunks from './chunk-manifest.json'; // eslint-disable-line import/no-unresolved
import configureStore from './store/configureStore';
import { setRuntimeVariable } from './store/runtime/actions';
import { loadState } from './utils/StorageUtils';
import SsmUtils from './utils/SsmUtils';
import { noAuthPaths, frontPluginPath } from './constants/pathConsts';
import { StripeApi, ProfileApi } from './api';
import config from './config';
import { CustomTheme } from './context';

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
  // send entire app down. Process manager will restart it
  process.exit(1);
});

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

const app = express();

const initializeConfigKeys = async () => {
  let stripeParamNames = ['stripe_sk', 'stripe_pkey', 'stripe_client_id'];
  if (process.env.NODE_ENV !== 'production') {
    stripeParamNames = stripeParamNames.map(p => `test_${p}`);
  }
  try {
    const stripeKeyParams = await SsmUtils.GetDecryptedParameters(
      stripeParamNames,
    );
    stripeKeyParams.forEach(({ Name, Value }) => {
      if (Name.endsWith('stripe_sk')) {
        config.stripe.secretKey = Value;
      } else if (Name.endsWith('stripe_pkey')) {
        config.stripe.publishableKey = Value;
      } else if (Name.endsWith('stripe_client_id')) {
        config.stripe.clientId = Value;
      } else {
        console.info('Unknown param received from ssm', Name);
      }
    });
  } catch (err) {
    console.error('Did not initialize config keys', err);
  }

  return { publishableKey: config.stripe.publishableKey };
};

//
// If you are using proxy from external machine, you can set TRUST_PROXY env
// Default is to trust proxy headers only from loopback interface.
// -----------------------------------------------------------------------------
app.set('trust proxy', config.trustProxy);

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// eslint-disable-next-line eqeqeq
const isHttpsReq = req => req.get('X-Forwarded-Proto') == 'https';
// eslint-disable-next-line eqeqeq
const isSecurePort = req => req.get('X-Forwarded-Port') == '443';

app.use((req, res, next) => {
  if (isHttpsReq(req) || req.hostname === 'localhost') {
    // request was via https or local, so do no special handling
    next();
  } else if (!isHttpsReq(req) && !isSecurePort(req)) {
    // Redirect if not HTTP with original request URL
    res.redirect(`https://${req.hostname}${req.url}`);
  }
});

// verify params for 3rd party auth routes
app.use((req, res, next) => {
  const { query, path: p } = req;
  if (p === frontPluginPath && query.auth_secret !== config.frontPluginKey) {
    res.status(403).send('Forbidden');
  } else {
    next();
  }
});

//
// Register API middleware
// -----------------------------------------------------------------------------
app.use(
  '/graphql',
  expressGraphQL(req => ({
    schema,
    graphiql: __DEV__,
    rootValue: { request: req },
    pretty: __DEV__,
  })),
);

app.use('/api/profile', ProfileApi);
app.use('/api/stripe', StripeApi);

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
const returnHTMLPage = (res, data, route) => {
  const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
  res.status(route.status || 200);
  res.send(`<!doctype html>${html}`);
};

app.get('*', async (req, res, next) => {
  try {
    const css = new Set();
    const materialSheets = new ServerStyleSheets();

    // Enables critical path CSS rendering
    // https://github.com/kriasoft/isomorphic-style-loader
    const insertCss = (...styles) => {
      // eslint-disable-next-line no-underscore-dangle
      styles.forEach(style => css.add(style._getCss()));
    };

    const initialState = loadState(req.cookies);
    const store = configureStore(initialState, {});

    store.dispatch(
      setRuntimeVariable({
        name: 'initialNow',
        value: Date.now(),
      }),
    );

    const stripeContext = await initializeConfigKeys();

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      insertCss,
      // The twins below are wild, be careful!
      pathname: req.path,
      query: req.query,
      // You can access redux through react-redux connect
      store,
      storeSubscription: null,
      stripeContext,
    };

    const platformCheckOpts = { ua: req.headers['user-agent'] };
    const isMobileAgent = isMobile(platformCheckOpts);
    context.isMobile = isMobileAgent;
    // Redirect to the mobile page if:
    // The the user agent matches mobile and
    // the user is not trying to load a non app page
    // and this path is not already for mobile
    if (isMobileAgent && !noAuthPaths.includes(req.path) && req.path !== '/') {
      res.redirect(302, '/');
      return;
    }

    // check if user agent is IE[7,8,9,10,11]
    const isIEAgent =
      platformCheckOpts.ua.includes('Trident') ||
      platformCheckOpts.ua.includes('MSIE');

    if (isIEAgent) {
      const html = ReactDOM.renderToString(
        materialSheets.collect(
          <ThemeProvider theme={CustomTheme}>
            <BrowserUnsupportedPage />
          </ThemeProvider>,
        ),
      );

      res.send(
        `<!doctype html><style>${materialSheets.toString()}</style>${html}`,
      );
      return;
    }

    const route = await router.resolve(context);

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect);
      return;
    }

    const data = { ...route };
    data.children = ReactDOM.renderToString(
      materialSheets.collect(<App context={context}>{route.component}</App>),
    );

    data.styles = [
      { id: 'css', cssText: [...css].join('') },
      { id: 'material-css', cssText: materialSheets.toString() },
    ];

    const scripts = new Set();
    const addChunk = chunk => {
      if (chunks[chunk]) {
        chunks[chunk].forEach(asset => scripts.add(asset));
      } else if (__DEV__) {
        throw new Error(`Chunk with name '${chunk}' cannot be found`);
      }
    };
    addChunk('client');
    if (route.chunk) addChunk(route.chunk);
    if (route.chunks) route.chunks.forEach(addChunk);

    data.scripts = Array.from(scripts);
    data.app = {
      apiUrl: config.api.clientUrl,
      state: context.store.getState(),
      stripeContext,
    };

    returnHTMLPage(res, data, route);
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(pe.render(err));
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
if (!module.hot) {
  app.listen(config.port, () => {
    console.info(`The server is running at http://localhost:${config.port}/`);
  });
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  app.hot = module.hot;
  module.hot.accept('./router');
}

export default app;
