/* eslint-disable lodash/prefer-lodash-method @flow */
import { minify } from 'html-minifier';
import serialize from 'serialize-javascript';

export default (
  head: Object,
  assets: Array,
): string => {
  const styles = assets.filter(file => file.endsWith('.css'));
  const scripts = assets.filter(file => file.endsWith('.js'));

  const html = `
    <!doctype html>
    <html ${head.htmlAttributes.toString()}>
      <head>
        <meta charset="utf-8" />
        <meta name="language" content="fr-FR" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" /> 
        <!--[if IE]>
          <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
        <![endif]-->

        <link rel="apple-touch-icon" href="apple-touch-icon.png">
        <link rel="shortcut icon" href="/favicon.ico">

        ${head.title.toString()}
        ${head.base.toString()}
        ${head.meta.toString()}
        ${head.link.toString()}

        <!-- Insert bundled styles into <link> tag -->
        ${styles
    .map(
      file =>
        `<link href="${file}" media="screen, projection" rel="stylesheet" type="text/css">`
    )
    .join('\n')}
      </head>
      <body>
        
        <!-- Insert the router, which passed from server-side -->
        <div id="react-view"></div>

        <!-- Insert bundled scripts into <script> tag -->
        ${scripts.map(file => `<script src="${file}"></script>`).join('\n')}
        <!-- head -->
        ${head.script.toString()}
      </body>
    </html>
  `;

  // html-minifier configuration, refer to "https://github.com/kangax/html-minifier" for more configuration
  const minifyConfig = {
    collapseWhitespace: true,
    removeComments: true,
    trimCustomFragments: true,
    minifyCSS: true,
    minifyJS: true,
    minifyURLs: true
  };

  // Minify html in production
  return __DEV__ ? html : minify(html, minifyConfig);
};