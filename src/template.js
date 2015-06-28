import fs from 'fs';
import path from 'path';
import frontMatter from 'front-matter';
import inflectors from 'inflectors';

export default class Template {
  constructor(filename, contents, destination, type) {
    this.source = contents;
    this.filename = filename;
    this.path = destination;
    this.type = type;
  }

  get id() {
    return path.basename(this.filename, '.md');
  }

  get destination() {
    return path.join(this.path, this.id+'.json');
  }

  get compiled() {
    return frontMatter(this.source);
  }

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

  get data() {
    return {
      type: inflectors.singularize(this.type),
      id: this.id,
      attributes: this.attributes
    }
  }

  get links() {
    return {
      self: "http://psychedeli.ca/"+this.type+"/"+this.id+".json"
    }
  }

  get asJSON() {
    return {
      data: this.data,
      links: this.links
    }
  }

  toJSON() {
    return JSON.stringify(this.asJSON);
  }


  compile() {
    fs.writeFile(this.destination, this.toJSON(), { encoding: 'utf-8' });
  }

  get publishable() {
    if (typeof this.attributes.published === 'undefined') {
      return true;
    } else {
      return this.attributes.published;
    }
  }
}
