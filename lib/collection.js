/* global require, module */

var Template = require('./template'),
    fs = require('fs');

/**
 * A collection of article source files used to back the Template
 * object, which we use to compile templates to HTML.
 *
 * @param {object} options - A hash of key/value pairs containing the
 *                           `source` and `destination` directories.
 * @constructor
 */
var Collection = function(options) {
  this.options = options;
  this.source = options.source;
  this.destination = options.destination;
  this.indexPath = this.destination+'.json';
};

/**
 * Instantiates templates from every Markdown source file encountered
 * in the source directory. Compiles each template to HTML then writes
 * the `/articles.json` index file. Since all of these actions take
 * place asynchronously, this method returns nothing.
 */
Collection.prototype.compile = function() {
  var collection = this;

  fs.readdir(this.source, function(error, files) {
    console.info('Compiling articles to static HTML');
    var index = { articles: [] };

    files.reverse().map(function(filename) {
      var name = null;

      if (filename !== '.gitkeep') {
        name = filename.split('.md').join('');
      }

      if (name !== null) {
        var template = new Template(collection, name);
        template.compile();
        index.articles.push(template.attributes());
      }
    });

    console.info('Compiling JSON index of articles');

    fs.writeFile(collection.indexPath, JSON.stringify(index));
  });
};

module.exports = Collection;
