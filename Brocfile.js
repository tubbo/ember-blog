/* global require, module, process */

var EmberApp = require('ember-cli/lib/broccoli/ember-app'),
    config = require('./config/environment')(process.env.EMBER_ENV),
    compile = require('./lib/compiler'),
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
    });

app.import('bower_components/moment/moment.js');

compile('articles');
compile('pages');

module.exports = app.toTree();
