import fs from 'fs';
import path from 'path';
import frontMatter from 'front-matter';

export default class Template {
  constructor(filename, contents) {
    this.source = contents;
    this.filename = filename;
    this.id = path.basename(filename, '.md');

    this.compiled = frontMatter(contents);
    this.attributes = this.compiled.attributes;
    this.attributes.id = this.id;
    this.attributes.body = this.compiled.body;
    this.destination = this.id+'.json';
  }

  toJSON() {
    return JSON.stringify({ article: this.attributes });
  }
}
