
import { matchRoutes, renderRoutes } from 'react-router-config';
import { StaticRouter } from 'react-router-dom';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
import Helmet from 'react-helmet';
import { renderToString } from 'react-dom/server';
import chalk from 'chalk';
import renderHtml from './utils/renderHtml';
import routes from './routes';

export default (req, res) => {

  (async () => {
    try {
      const modules = [];
      const staticContext = {};


      // Check if the render result contains a redirect, if so we need to set
      // the specific status and redirect header and end the response
      if (staticContext.url) {
        res.status(301).setHeader('Location', staticContext.url);
        res.end();

        return;
      }
      // Check page status
      const status = staticContext.status === '404' ? 404 : 200;

      const head = Helmet.renderStatic();


      // $FlowFixMe: isn't an issue
      const loadableManifest = require('../public/loadable-assets.json');
      const bundles = getBundles(loadableManifest, modules);
      let assets = bundles
        .map(({ publicPath }) =>
          !publicPath.includes('main') ? publicPath : ''
        )
      // In development, main.css and main.js are webpack default file bundling name
      // we put these files into assets with publicPath
        .concat(['/assets/main.css', '/assets/main.js']);

      if (!__DEV__) {
        // $FlowFixMe: isn't an issue
        const webpackManifest = require('../public/webpack-assets.json');

        assets = bundles
          .map(({ publicPath }) => publicPath)
        //  .filter((item, index) => bundles.indexOf(item) >= index)
          .concat(
            Object.keys(webpackManifest)
              .map(key => webpackManifest[key])
              .reverse()
          );
      }


      // Pass the route and initial state into html template
      res
        .status(status)
        .send(renderHtml(
          head,
          assets
        ));


    } catch (err) {
      res.status(404).send('Not Found :(');

      console.error(chalk.red(`==> 😭  Rendering routes error: ${err}`));
    }
  })();
};

