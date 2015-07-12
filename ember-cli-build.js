/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
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
    },
    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src': "'self'",
      'font-src': "'self' http://fonts.gstatic.com", // Allow fonts to be loaded from http://fonts.gstatic.com
      'connect-src': "'self'",
      'img-src': "'self'",
      'style-src': "'self' 'unsafe-inline' http://fonts.googleapis.com", // Allow inline styles and loaded CSS from http://fonts.googleapis.com
      'media-src': "'self'"
    }
  }),
  config = require('./config/environment')(process.env.EMBER_ENV),
  compile = require('./lib/compiler');

  compile('articles');
  compile('pages');

  app.import('bower_components/moment/moment.js');
  app.import('bower_components/marked/lib/marked.js');
  app.import('bower_components/prism/prism.js');
  app.import('bower_components/prism/themes/prism.css');

  return app.toTree();
};
