const nodeEnv = process.env.NODE_ENV || 'development';
const isDev = nodeEnv === 'development';

module.exports = {
  cssModulesIdentifier : isDev ? '[path][local]' : '[hash:base64:8]',
  chunkFileName : isDev ? '[id].chunk' : '[id].[chunkhash:8].chunk',
  fileName : isDev ? '[name]' : '[name].[chunkhash:8]',
  staticFilesName : '[name].[hash:8].[ext]'
};
