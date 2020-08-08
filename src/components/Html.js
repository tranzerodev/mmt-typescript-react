import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript';
import config from '../config';
import portalConfig from '../portalConfig';

/* eslint-disable react/no-danger */
const Html = ({ title, description, styles, scripts, app, children }) => {
  const cssStyles = styles.filter(s => s.id !== 'styled-component');
  const styleElementObj = styles.filter(s => s.id === 'styled-component');

  return (
    <html className="no-js" lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              process.env.DISABLE_REACT_DEV === 'true'
                ? "if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === 'object') { window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function(){}}"
                : '',
          }}
        />
        {scripts.map(script => (
          <link key={script} rel="preload" href={script} as="script" />
        ))}

        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-icon-180x180.png"
        />
        <link
          rel="shortcut icon"
          href={portalConfig.assets.faviconUrl}
          type="image/x-icon"
        />
        <link
          rel="icon"
          href={portalConfig.assets.faviconUrl}
          type="image/x-icon"
        />
        <link rel="manifest" href="/manifest.json" />
        <link
          href="https://fonts.googleapis.com/css?family=Cabin&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/styles/overrides.css" />
        <link
          rel="stylesheet"
          type="text/css"
          charSet="UTF-8"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
        {cssStyles.map(style => (
          <style
            key={style.id}
            id={style.id}
            dangerouslySetInnerHTML={{ __html: style.cssText }}
          />
        ))}
        {styleElementObj.elements}
      </head>
      <body>
        <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
        <script
          dangerouslySetInnerHTML={{ __html: `window.App=${serialize(app)}` }}
        />
        {scripts.map(script => (
          <script key={script} src={script} />
        ))}

        {config.analytics.googleTrackingId && (
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${
              config.analytics.googleTrackingId
            }`}
          />
        )}
        {config.analytics.googleTrackingId && (
          <script
            dangerouslySetInnerHTML={{
              __html:
                'window.dataLayer = window.dataLayer || [];' +
                'function gtag(){dataLayer.push(arguments);}' +
                'gtag("js", new Date());' +
                `gtag('config', '${config.analytics.googleTrackingId}');`,
            }}
          />
        )}
        <script src="https://js.stripe.com/v3/" />
      </body>
    </html>
  );
};

Html.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  styles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      cssText: PropTypes.string,
      elements: PropTypes.arrayOf(PropTypes.node),
    }).isRequired,
  ),
  scripts: PropTypes.arrayOf(PropTypes.string.isRequired),
  app: PropTypes.object, // eslint-disable-line
  children: PropTypes.string.isRequired,
};

Html.defaultProps = {
  styles: [],
  scripts: [],
};

export default Html;
