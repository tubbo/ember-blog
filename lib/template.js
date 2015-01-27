/* global require, module */

var marked = require('marked'),
    fs = require('fs'),
    path = require('path'),
    root = require('app-root-path'),
    yaml = require('js-yaml'),
    merge = require('merge'),
    reject = require('reject'),
    cheerio = require('cheerio');

/**
 * A template compiler engine which reads a source in Markdown and Front
 * Matter and exports it to HTML and an attributes object (respectively).
 * This function takes a collection and Markdown filename and uses it to
 * instantiate a new Template object from the prototype.
 *
 * @param {Collection} collection - A collection of articles which this
 * template was instantiated from. Includes some folder-specific data we
 * need to compile this template.
 * @param {string} filename - Serves as the ID for this Template and is
 * used to create the source and destination file paths.
 *
 * @constructor
 */
var Template = function(collection, filename) {
  this.collection = collection;
  this.id = filename;
  this.source = path.join(root.path, collection.source, filename+'.md');
  var destinationPath = path.join(root.path, collection.destination, filename);
  this.destination = destinationPath+'.html';
  this.preview = destinationPath+'.preview.html';
  this.json = destinationPath+'.json';
};

/**
 * Compiles the Markdown source to HTML and writes that output to the
 * destination file. Returns nothing since this is an asynchronous
 * operation.
 */
Template.prototype.compile = function() {
  fs.writeFile(this.destination, this.toHTML());
  fs.writeFile(this.preview, this.toPreview());
  fs.writeFile(this.json, this.toJSON());
};

/**
 * Compiles Article Markdown contents to HTML using the excellent Marked
 * library.
 *
 * @returns {string} the HTML result of the compiled article template
 */
Template.prototype.toHTML = function() {
  return marked(this.toMarkdown());
};

Template.prototype.toPreview = function() {
  var $ = cheerio.load(this.toHTML());
  return $('p').first().html();
};

Template.prototype.toJSON = function() {
  return JSON.stringify({ article: this.attributes() });
};

/**
 * Finds Article attributes from the YAML front matter using the YAML.js
 * library to parse it into a hash of attributes.
 *
 * @returns {object} the metadata for this article in key/value pairs.
 */
Template.prototype.attributes = function() {
  return merge({ id: this.id }, yaml.safeLoad(this.toYAML()));
};

/**
 * Reads article contents and tokenizes it using the delimiter '---'.
 *
 * @returns {array} the tokenized article contents.
 */
Template.prototype.contents = function() {
  return fs.readFileSync(this.source).toString().split('---');
};

/**
 * Returns the last part of the output of contents() which is the
 * Markdown source of this Article.
 *
 * @returns {string} the source of this Article in Markdown.
 */
Template.prototype.toMarkdown = function() {
  return this.contents()[2];
};

/**
 * The raw YAML front matter used to give this Article some metadata.
 *
 * @returns {string} the raw YAML front matter.
 */
Template.prototype.toYAML = function() {
  return this.contents()[1];
};

module.exports = Template;
