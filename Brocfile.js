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

app.import('bower_components/ember-document-title/dist/document-title.amd.js', {
  exports: {
    'ember-document-title': ['default']
  }
});

module.exports = app.toTree();
