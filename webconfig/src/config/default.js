/* @flow */

module.exports = {
  host: process.env.NODE_HOST || 'localhost', // Define your host from 'package.json'
  port: process.env.PORT,
  app: {
    htmlAttributes: { lang: 'fr' },
    title: 'Grappe',
    titleTemplate: 'Grappe - %s',
    meta: [
      {
        name: 'description',
        content: 'Configurez votre machine'
      }
    ]
  }
};
