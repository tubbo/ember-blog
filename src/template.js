import fs from 'fs';
import path from 'path';
import frontMatter from 'front-matter';

export default class Template {
  constructor(filename, contents, destination) {
    this.source = contents;
    this.filename = filename;
    this.id = path.basename(filename, '.md');

    this.compiled = frontMatter(contents);
    this.attributes = this.compiled.attributes;
    this.attributes.id = this.id;
    this.attributes.body = this.compiled.body;
    this.destination = path.join(destination, this.id+'.json');
  }

  toJSON() {
    return JSON.stringify({ article: this.attributes });
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
