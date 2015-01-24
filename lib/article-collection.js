var ArticleTemplate = require('./article-template'),
    fs = require('fs');

var ArticleCollection = function(options) {
  this.options = options;
  this.source = options.source;
  this.destination = options.destination;
  this.indexPath = this.destination+'.json'
};

ArticleCollection.prototype.compile = function() {
  var collection = this;

  fs.readdir(this.source, function(error, files) {
    console.info('Compiling articles to static HTML');
    var index = [];

    files.map(function(filename) {
      if (filename !== '.gitkeep') {
        var id = filename.split('.md').join('');
      }

      if (id) {
        var template = new ArticleTemplate(collection, id);
        template.compile();
        index.push(template.attributes());
      }
    });

    console.info('Compiling JSON index of articles');

    fs.writeFile(collection.indexPath, JSON.stringify(index));
  });
};

module.exports = ArticleCollection;
