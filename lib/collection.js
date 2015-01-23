var Template = require('./template'),
    root = require('app-root-path'),
    path = require('path'),
    fs = require('fs');

var FrontMatter = function() {
  this.source = 'app/articles';
  this.destination = 'public/articles';
  this.root = root.path;
};

FrontMatter.prototype.compile = function() {
  console.log('Compiling articles to static HTML');
  var source = this.source,
      destination = this.destination,
      root = this.root;

  fs.readdir(this.source, function(error, files) {
    var index = [];

    files.forEach(function(file) {
      var sourcePath = path.join(root, source, file),
          htmlFile = file.split('.md').join('.html'),
          destinationPath = path.join(root, destination, htmlFile),
          template = new Template(sourcePath, destinationPath);

      template.compile();
      index.push(template.attributes());
    });

    fs.writeFile(root+'/'+destination+'.json', JSON.stringify(index));
  });
};

module.exports = FrontMatter;
