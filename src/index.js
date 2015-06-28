import fs from 'fs';

export default class Index {
  constructor(path, type) {
    this.path = path+'.json';
    this.items = [];
    this.type = type;
  }

  push(item) {
    let attrs = item.data;
    attrs.links = {};
    for (let link in item.links) {
      attrs.links[link] = item.links[link]
    }
    this.items.push(attrs);

    fs.writeFile(this.path, this.toJSON());
  }

  toJSON() {
    return JSON.stringify({
      data: this.items
    });
  }
}
