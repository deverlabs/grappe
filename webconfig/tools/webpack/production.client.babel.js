import merge from 'webpack-merge';
import webpack from 'webpack';
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import ImageminPlugin from 'imagemin-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { version } from '../../package.json';
import baseConfig from './base.config';

export default merge.strategy({
  entry: 'replace'
})(baseConfig, {
  entry: {
    app: ['./src/client.js']
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.jsx?$|\.css$|\.(scss|sass)$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    // Smaller modular Lodash build
    new LodashModuleReplacementPlugin({
      'paths': true
    }),
    // Plugin to compress images with imagemin
    // Check "https://github.com/Klathmon/imagemin-webpack-plugin" for more configurations
    new ImageminPlugin({
      pngquant: { quality: '95-100' }
    }),
    // Visualize all of the webpack bundles
    // Check "https://github.com/webpack-contrib/webpack-bundle-analyzer#options-for-plugin"
    // for more configurations
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.NODE_ENV === 'analyze' ? 'server' : 'disabled'
    }),
    new webpack.BannerPlugin({
      banner: `
      Author: Nathan KREMER 🐔
      Build Version: ${version}
      Generated on: ${new Date().toISOString()}
      Filename: [name]
      Hash: [hash]
      Chunkhash: [chunkhash]`
    })
  ]
});
