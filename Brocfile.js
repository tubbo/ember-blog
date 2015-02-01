/* global require, module, process */

var EmberApp = require('ember-cli/lib/broccoli/ember-app'),
    config = require('./config/environment')(process.env.EMBER_ENV),
    app = new EmberApp({
      staticAge: {
        resources: ['articles', 'pages']
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
    });

module.exports = app.toTree();
