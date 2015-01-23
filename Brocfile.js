/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app'),
    ArticlesCollection = require('./lib/collection'),
    app = new EmberApp(),
    articles = new ArticlesCollection();

articles.compile();

module.exports = app.toTree();
