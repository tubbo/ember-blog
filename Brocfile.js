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
      sassOptions: {
        includePaths: [
          'bower_components/foundation/scss'
        ]
      },
      inlineContent: {
        'google-analytics' : {
          file: './ga.js',
          postProcess: function(content) {
            return content.replace(
                /\{\{GOOGLE_ANALYTICS_ID\}\}/g,
                config.googleAnalyticsId
            );
          }
        }
      }
    }),
   articles = new Collection({ key: 'articles' }),
   pages = new Collection({ key: 'pages' });

articles.compile();
pages.compile();

module.exports = app.toTree();
