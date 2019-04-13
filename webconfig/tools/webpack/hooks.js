/* @flow */

/* Require hooks for server-side */

const path = require('path');
const sass = require('node-sass');
const postcssConfig = require('../../postcss.config');
const config = require('./config');

const { cssModulesIdentifier, staticFilesName } = config;


module.exports = () => {
  // CSS modules
  require('css-modules-require-hook')({
    // Must use the same pattern with your webpack config
    generateScopedName: cssModulesIdentifier,
    extensions: ['.css', '.scss', '.sass'],
    // prepend: [...postcssConfig.plugins],
    preprocessCss: (data, filename) =>
      sass.renderSync({
        data,
        file: filename
      }).css,
    rootDir: path.resolve(process.cwd(), 'src'),
    devMode: true
  });

  // Images
  require('asset-require-hook')({
    // Must use the same option with webpack's configuration
    extensions: ['gif', 'jpg', 'jpeg', 'png', 'webp'],
    publicPath: '/assets/',
    limit: 10240,
    name: staticFilesName
  });

  // Fonts
  require('asset-require-hook')({
    // Must use the same option with webpack's configuration
    extensions: ['woff', 'woff2', 'ttf', 'eot', 'svg'],
    publicPath: '/assets/',
    limit: 10240,
    name: staticFilesName
  });
};
