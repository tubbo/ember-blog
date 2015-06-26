import fs from 'fs';
import path from 'path';
import frontMatter from 'front-matter';

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
      id: this.id,
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

  toJSON() {
    let attrs = {};
    attrs[this.type] = this.attributes;
    return JSON.stringify(attrs);
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
