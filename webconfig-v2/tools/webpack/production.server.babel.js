import path from 'path';
import merge from 'webpack-merge';
import webpack from 'webpack';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin';
import ImageminPlugin from 'imagemin-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import baseConfig from './base.config';
import config from './config';

export default merge.strategy({
  entry: 'replace',
  output: 'replace',
  optimization : 'replace',
  module: 'replace',
  plugins: 'replace'
})(baseConfig, {
  entry: './src/handler.js',
  output: {
    libraryTarget: 'commonjs',
    filename: './handler.built.js',
    globalObject: 'this'
  },
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all',
      name: true
    },
  },
  externals: [
    // html files are required directly
    /\.(html|png|gif|jpg)$/,
    // treat all node modules as external to keep this bundle small
    nodeExternals({
      // this WILL include `jquery` and `webpack/hot/dev-server` in the bundle, as well as `lodash/*`
      whitelist: [/\.(?!(?:jsx?|json)$).{1,5}$/i] })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, '../../src')
        ],
        loader: 'babel',
        options: { cacheDirectory: false }
      },
      {
        test: /\.(css)$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: config.cssModulesIdentifier,
              context: './src',
            }
          },
          { loader: 'postcss-loader' },
        ]
      },
      {
        test: /\.(scss|sass)$/,
        exclude: [
          path.resolve(__dirname, '../node_modules'),
        ],
        use: [
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 2,
              localIdentName: config.cssModulesIdentifier,
              context: './src',
            }
          },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' },

        ]
      },

      {
        test: /\.(woff2?|ttf|eot|svg)$/,
        loader: 'url',
        options: { limit: 10240, name: config.staticFilesName }
      },
      {
        test: /\.(gif|png|jpe?g|webp)$/,
        // Any image below or equal to 10K will be converted to inline base64 instead
        loader: 'url',
        options: { limit: 10240, name: config.staticFilesName }
      }
    ]
  },

  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
    // Setup global variables for client
    new webpack.DefinePlugin({
      __CLIENT__: false,
      __SERVER__: true,
      __DEV__: false
    }),
    new FriendlyErrorsWebpackPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    // Minimizing style for production
    new OptimizeCssAssetsPlugin(),
    // Smaller modular Lodash build
    new LodashModuleReplacementPlugin(),
    // Plugin to compress images with imagemin
    // Check "https://github.com/Klathmon/imagemin-webpack-plugin" for more configurations
    new ImageminPlugin({
      pngquant: { quality: '95-100' }
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.NODE_ENV === 'analyze' ? 'server' : 'disabled'
    })
  ],
});

