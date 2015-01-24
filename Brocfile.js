/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app'),
    ArticleCollection = require('./lib/article-collection'),
    app = new EmberApp({
      sassOptions: {
        includePaths: [
          'bower_components/foundation/scss'
        ]
      }
    }),
    articles = new ArticleCollection({
      source: 'app/articles',
      destination: 'public/articles'
    });

articles.compile();

module.exports = app.toTree();
