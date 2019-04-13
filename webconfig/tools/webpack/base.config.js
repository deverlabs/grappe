import path from 'path';
import webpack from 'webpack';
import ManifestPlugin from 'webpack-manifest-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import { ReactLoadablePlugin } from 'react-loadable/webpack';
import config from './config';

const nodeEnv = process.env.NODE_ENV || 'development';
const isDev = nodeEnv === 'development';

// Enable/disable css modules here
const USE_CSS_MODULES = true;

// Setup the plugins for development/prodcution
const getPlugins = () => {
  // Common
  const plugins = [
    new ManifestPlugin({
      fileName: path.resolve(process.cwd(), 'public/webpack-assets.json'),
      filter: file => file.isInitial
    }),
    new ReactLoadablePlugin({
      filename: 'public/loadable-assets.json'
    }),
    new MiniCssExtractPlugin({
      // Don't use hash in development, we need the persistent for "renderHtml.js"
      filename: `${config.fileName}.css`,
      chunkFilename: `${config.chunkFileName}.css`
    }),
    // Setup enviorment variables for client
    new webpack.EnvironmentPlugin({ NODE_ENV: JSON.stringify(nodeEnv) }),
    // Setup global variables for client
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEV__: isDev
    })
  ];

  if (isDev) {
    // Development
    plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new FriendlyErrorsWebpackPlugin()
    );
  }
  return plugins;
};

// Setup the entry for development/prodcution
const getEntry = () => {
  // Development
  const entry = ['webpack-hot-middleware/client?reload=true', './src/client.js'];

  return entry;
};

// Webpack configuration
module.exports = {
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'eval' : 'hidden-source-map',
  context: path.resolve(process.cwd()),
  entry: getEntry(),
  optimization: {
    splitChunks: {
      // Auto split vendor modules in production only
      chunks: isDev ? 'async' : 'all'
    }
  },
  output: {
    path: path.resolve(process.cwd(), 'public/assets'),
    publicPath: '/assets/',
    filename: `${config.fileName}.js`,
    chunkFilename: `${config.chunkFileName}.js`,
    pathinfo: isDev
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        options: { cacheDirectory: isDev }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'css-hot',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css',
            options: {
              importLoaders: 1,
              modules: USE_CSS_MODULES,
              localIdentName: config.cssModulesIdentifier,
              context: path.resolve(process.cwd(), 'src'),
              sourceMap: true
            }
          },
          { loader: 'postcss', options: { sourceMap: true } }
        ]
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css',
            options: {
              importLoaders: 1,
              modules: false,
              sourceMap: true
            }
          },
          { loader: 'postcss', options: { sourceMap: true } }
        ]
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          'css-hot',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css',
            options: {
              importLoaders: 2,
              modules: USE_CSS_MODULES,
              localIdentName: config.cssModulesIdentifier,
              context: path.resolve(process.cwd(), 'src'),
              sourceMap: true
            }
          },
          { loader: 'postcss', options: { sourceMap: true } },
          {
            loader: 'sass',
            options: {
              outputStyle: 'expanded',
              sourceMap: true,
              sourceMapContents: !isDev
            }
          }
        ]
      },
      {
        test: /\.(woff2?|ttf|eot|svg)$/,
        loader: 'url',
        options: { limit: 10240, name:  config.staticFilesName }
      },
      {
        test: /\.(gif|png|jpe?g|webp)$/,
        // Any image below or equal to 10K will be converted to inline base64 instead
        loader: 'url',
        options: { limit: 10240, name:  config.staticFilesName }
      }
    ]
  },
  plugins: getPlugins(),
  /* Advanced configuration */
  resolveLoader: {
    // Use loaders without the -loader suffix
    moduleExtensions: ['-loader']
  },
  resolve: {
    modules: ['src', 'node_modules'],
    descriptionFiles: ['package.json'],
    extensions: ['.js', '.jsx', '.json'],
    alias: isDev ? {
      'react-dom': '@hot-loader/react-dom',
    } : {},
  },
  cache: isDev,
  node: {
    fs: 'empty',
    vm: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
