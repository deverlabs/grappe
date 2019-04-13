const cssnano = require('cssnano')({
  preset: ['default', {
    discardComments: {
      removeAll: true,
    },
  }]
});
const postcssPresetEnv = require('postcss-preset-env');

const pluginsList = [postcssPresetEnv({ stage: 0 })];

if (process.env.NODE_ENV === 'production') {
  pluginsList.push(cssnano);
}

module.exports = {
  plugins: pluginsList
};