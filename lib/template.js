var marked = require('marked'),
    fs = require('fs'),
    path = require('path');

var Template = function(source, destination) {
  this.source = source;
  this.destination = destination;
  this.filename = path.basename(this.source).split('.md').join('');
};

Template.prototype.contents = function() {
  return fs.readFileSync(this.source).toString().split('---');
};

Template.prototype.compile = function() {
  fs.writeFile(this.destination, this.toHTML());
};

Template.prototype.toHTML = function() {
  return marked(this.body());
};

Template.prototype._yaml = function() {
  return this.contents()[1];
};

Template.prototype.attributes = function() {
  var hash = { id: this.filename };
  this._yaml().split("\n").map(function(item) {
    if (item !== '') {
      var line = item.split(": ");
      var key = line[0];
      var value = line[1];
      hash[key] = value;
    }
  });
  return hash;
};

Template.prototype.body = function() {
  return this.contents()[2];
};

module.exports = Template;
