/* global require, module, process */

var EmberApp = require('ember-cli/lib/broccoli/ember-app'),
    compiler = require('./lib/compiler'),
    config = require('./config/environment')(process.env.EMBER_ENV),
    app = new EmberApp({
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
    articles = compiler.build('articles'),
    pages = compiler.build('pages');

articles.compile();
pages.compile();

module.exports = app.toTree();
