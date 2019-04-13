/* @flow */

import React from 'react';
import { hydrate } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { StaticRouter, BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import Loadable from 'react-loadable';
import routes from './routes';

const render = (Routes: Array<Object>) => {
  hydrate(
    <AppContainer>
      <StaticRouter>
        <BrowserRouter>{renderRoutes(Routes)}</BrowserRouter>
      </StaticRouter>
    </AppContainer>,
    // $FlowFixMe: isn't an issue
    document.getElementById('react-view')
  );
};

// react-loadable setup
Loadable.preloadReady().then(() => render(routes));

if (module.hot) {
  // Enable webpack hot module replacement for routes
  module.hot.accept('./routes', () => {
    try {
      const nextRoutes = require('./routes').default;

      render(nextRoutes);
    } catch (error) {
      console.error(`==> 😭  Routes hot reloading error ${error}`);
    }
  });
}
