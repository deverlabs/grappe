/* eslint-disable */
/* @flow */

import path from 'path';
import logger from 'morgan';
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import hpp from 'hpp';
import favicon from 'serve-favicon';
import React from 'react';
import { renderToString } from 'react-dom/server';
import chalk from 'chalk';
// $FlowFixMe: isn't an issue
import { port, host } from './config';
import Loadable from 'react-loadable';
const app = express();
import render from  './render'


// Use helmet to secure Express with various HTTP headers
app.use(helmet());
// Prevent HTTP parameter pollution
app.use(hpp());
// Compress all requests
app.use(compression());
// Use for http request debug (show errors only)
app.use(logger('dev', { skip: (req, res) => res.statusCode < 400 }));
app.use(favicon(path.resolve(process.cwd(), 'public/images/favicon.png')));
app.use(express.static(path.resolve(process.cwd(), 'public')));
app.use('/locales', express.static(path.resolve(process.cwd(), 'src/locales')))


if (!__DEV__) {
  app.use(express.static(path.resolve(process.cwd(), 'public')));
} else {
  /* Run express as webpack dev server */

  const webpack = require('webpack');
  const webpackConfig = require('../tools/webpack/base.config');
  const compiler = webpack(webpackConfig);

  new webpack.ProgressPlugin().apply(compiler);


  app.use(
    require('webpack-dev-middleware')(compiler, {
      publicPath: webpackConfig.output.publicPath,
      headers: { 'Access-Control-Allow-Origin': '*' },
      hot: true,
      quiet: true, // Turn it on for friendly-errors-webpack-plugin
      noInfo: true,
     // writeToDisk: true,
      stats: { color: true, children: false },
      serverSideRender: true
    })
  )

  app.use(
    require('webpack-hot-middleware')(compiler, {
      log: false // Turn it off for friendly-errors-webpack-plugin
    })
  );
}

// Register server-side rendering middleware
app.get('*', (req, res) => {
  return render(req,res)
});

if (port) { 
  Loadable.preloadAll().then(() => {
    app.listen(port, host, err => {
      const url = `http://${host}:${port}`;

      if (err) console.error(chalk.red(`==> 😭  OMG!!! ${err}`));

      console.info(chalk.green(`==> 🌎  Listening at ${url}`));

      // Open browser
  //    if (openBrowser(url))
        //console.info(chalk.green("==> 🖥️  Opened on your browser's tab!"));
    });
  });
} else {
  console.error(
    chalk.red('==> 😭  OMG!!! No PORT environment variable has been specified')
  );
}
