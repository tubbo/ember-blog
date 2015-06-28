import fs from 'fs';
import path from 'path';
import frontMatter from 'front-matter';
import inflectors from 'inflectors';

/**
 * The object responsible for reading and parsing template data as well
 * as compiling singular templates down to JSON.
 */
export default class Template {
  /**
   * @constructor
   * @param {String} filename
   * @param {String} contents
   * @param {String} destination
   * @param {String} type
   */
  constructor(filename, contents, destination, type) {
    this.source = contents;
    this.filename = filename;
    this.path = destination;
    this.type = type;
  }

  /**
   * The filename of this page without its extension or path.
   *
   * @type {String}
   */
  get id() {
    return path.basename(this.filename, '.md');
  }

  /**
   * The destination JSON path that this file will be compiled to.
   *
   * @type {String}
   */
  get destination() {
    return path.join(this.path, this.id+'.json');
  }

  /**
   * Compiled attributes by the front-matter module.
   *
   * @type {Object}
   */
  get compiled() {
    return frontMatter(this.source);
  }

  /**
   * Combined body and attributes from front-matter.
   *
   * @type {Object}
   */
  get attributes() {
    let attrs = {};
    let defaults = {
      body: this.compiled.body
    };

    for (let attr in defaults) {
      attrs[attr] = defaults[attr];
    }
    for (let attr in this.compiled.attributes) {
      attrs[attr] = this.compiled.attributes[attr];
    }

    return attrs;
  }

  /**
   * Whether this document can be published...if not specified, the
   * document will be published.
   *
   * @type boolean
   */
  get publishable() {
    if (typeof this.attributes.published === 'undefined') {
      return true;
    } else {
      return this.attributes.published;
    }
  }

  /**
   * Attributes formatted for the JSON API standard.
   *
   * @type {Object}
   */
  get data() {
    return {
      type: inflectors.singularize(this.type),
      id: this.id,
      attributes: this.attributes
    }
  }

  /**
   * To maintain JSON API compliance, this is a "link" to the current
   * JSON document.
   *
   * @type {String}
   */
  get links() {
    return {
      self: "http://psychedeli.ca/"+this.type+"/"+this.id+".json"
    }
  }

  /**
   * An object formatted for the JSON API standard that is used as the
   * basis for this.toJSON()
   *
   * @type {Object}
   */
  get asJSON() {
    return {
      data: this.data,
      links: this.links
    }
  }

  /**
   * An object formatted for the JSON API collection standard that is
   * used in Index#toJSON.
   *
   * @type {Object}
   */
  get asItem() {
    let attrs = item.data;
    attrs.links = {};
    for (let link in item.links) {
      attrs.links[link] = item.links[link]
    }
    return attrs;
  }

  /**
   * The JSON API representation of this template.
   *
   * @returns {String}
   */
  toJSON() {
    return JSON.stringify(this.asJSON);
  }

  /**
   * Writes a JSON representation of the document to disk.
   *
   * @returns boolean
   */
  compile() {
    fs.writeFile(this.destination, this.toJSON(), { encoding: 'utf-8' });
  }
}
