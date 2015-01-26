/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app'),
    ArticleCollection = require('./lib/article-collection'),
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
    articles = new ArticleCollection({
      source: 'app/articles',
      destination: 'public/articles'
    });

articles.compile();

/*app.import('bower_components/ember-document-title/dist/document-title.amd.js', {
  exports: {
    'ember-document-title': ['default']
  }
});*/

module.exports = app.toTree();
