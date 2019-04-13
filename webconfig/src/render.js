const env = process.env.NODE_ENV || 'development';
/*eslint-disable */
const handleRender = require(
  env === 'production' ? './handler.built' : './handler'
).default;

module.exports = handleRender;
