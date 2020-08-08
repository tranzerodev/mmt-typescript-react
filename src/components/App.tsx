import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Auth, API, Storage } from 'aws-amplify';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import { StylesProvider, ThemeProvider } from '@material-ui/core';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import portalConfig from '../portalConfig';
import { CustomTheme, RouteContext } from '../context';

Auth.configure(portalConfig.AWS.Auth);
API.configure(portalConfig.AWS.API);
Storage.configure(portalConfig.AWS.Storage);

interface AppProps {
  context: {
    insertCss: (...styles: any[]) => () => void;
    pathname: string;
    query: Record<string, any>;
    isMobile: boolean;
    store: any;
    stripeContext: { publishableKey: string };
  };
  children: React.ReactNode;
}
/**
 * The top-level React component setting context (global) variables
 * that can be accessed from all the child components.
 *
 * https://facebook.github.io/react/docs/context.html
 *
 * Usage example:
 *
 *   const context = {
 *     history: createBrowserHistory(),
 *     store: createStore(),
 *   };
 *
 *   ReactDOM.render(
 *     <App context={context}>
 *       <Layout>
 *         <LandingPage />
 *       </Layout>
 *     </App>,
 *     container,
 *   );
 */

const App: React.FC<AppProps> = ({ context, children }) => {
  // NOTE: If you need to add or modify header, footer etc. of the app,
  // please do that inside the Layout component.
  const {
    pathname,
    query,
    isMobile,
    insertCss,
    store,
    stripeContext,
  } = context;

  const routeContext = { pathname, query, isMobile };
  const [stripePromise] = React.useState(
    loadStripe(stripeContext.publishableKey),
  );

  return (
    <RouteContext.Provider value={routeContext}>
      <StyleContext.Provider value={{ insertCss }}>
        <ReduxProvider store={store}>
          <ThemeProvider theme={CustomTheme}>
            <Elements stripe={stripePromise}>
              <StylesProvider>{React.Children.only(children)}</StylesProvider>
            </Elements>
          </ThemeProvider>
        </ReduxProvider>
      </StyleContext.Provider>
    </RouteContext.Provider>
  );
};

export default App;
