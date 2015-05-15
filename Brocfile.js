/* global require, module, process */

var EmberApp = require('ember-cli/lib/broccoli/ember-app'),
    config = require('./config/environment')(process.env.EMBER_ENV),
    Collection = require('static-age/compiler/collection'),
    app = new EmberApp({
      vendorFiles: {
        "handlebars.js": null
      },
      staticAge: {
        resources: ['pages', 'pages']
      },
      'ember-cli-foundation-sass': {
        'modernizr': true,
        'fastclick': true,
        'foundationJs': 'all'
      }
    }),
   articles = new Collection({ key: 'articles' }),
   pages = new Collection({ key: 'pages' });

articles.compile();
pages.compile();

module.exports = app.toTree();
