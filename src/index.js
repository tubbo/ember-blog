import fs from 'fs';

export default class Index {
  constructor(path, type) {
    this.path = path+'.json';
    this.items = [];
    this.type = type;
  }

  push(item) {
    this.items.push(item.attributes);
    fs.writeFile(this.path, this.toJSON(), function(error) {
      if (error) { throw error; }
    });
  }

  toJSON() {
    let items = {};
    items[this.type] = this.items;
    return JSON.stringify(items);
  }
}
