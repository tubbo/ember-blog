/**
 * Template compiler engine which reads a source in Markdown and Front
 * Matter and exports it to HTML and an attributes object
 * (respectively).
 */

var marked = require('marked'),
    fs = require('fs'),
    path = require('path'),
    root = require('app-root-path'),
    yaml = require('js-yaml'),
    merge = require('merge');

/**
 * Instantiates a new template from a filename and a Collection object.
 *
 * @param {Collection} collection - A collection of articles which this
 * template was instantiated from. Includes some folder-specific data we
 * need to compile this template.
 * @param {string} filename - Serves as the ID for this Template and is
 * used to create the source and destination file paths.
 *
 * @constructor
 */
var ArticleTemplate = function(collection, filename) {
  this.collection = collection;
  this.id = filename;
  this.source = path.join(root.path, collection.source, filename+'.md');
  this.destination = path.join(root.path, collection.destination, filename+'.html');
};

/**
 * Compiles the Markdown source to HTML and writes that output to the
 * destination file. Returns nothing since this is an asynchronous
 * operation.
 */
ArticleTemplate.prototype.compile = function() {
  fs.writeFile(this.destination, this.toHTML());
};

/**
 * Uses the Marked library to convert the Article, written in Markdown,
 * to HTML.
 *
 * @returns {string} the HTML result of the compiled article template
 */
ArticleTemplate.prototype.toHTML = function() {
  return marked(this.toMarkdown());
};

/**
 * Uses the YAML.js library to parse the front matter into a hash of
 * JSON attributes.
 *
 * @returns {object} a hash of attributes containing this article's
 * metadata.
 */
ArticleTemplate.prototype.attributes = function() {
  return merge({ id: this.id }, yaml.safeLoad(this.toYAML()));
};

/**
 * Reads article contents and splits it by the delimiter '---'.
 *
 * @returns {array} collection containing the YAML front matter and
 * Markdown source.
 */
ArticleTemplate.prototype.contents = function() {
  return fs.readFileSync(this.source).toString().split('---');
};

/**
 * Returns the last part of the output of contents() which is the
 * Markdown source of this Article.
 *
 * @returns {string} the source of this Article in Markdown.
 */
ArticleTemplate.prototype.toMarkdown = function() {
  return this.contents()[2];
};

/**
 * The raw YAML front matter used to give this Article some metadata.
 *
 * @returns {string} the raw YAML front matter.
 */
ArticleTemplate.prototype.toYAML = function() {
  return this.contents()[1];
};

module.exports = ArticleTemplate;
