import fs from 'fs';

export default class Index {
  constructor(path, type) {
    this.path = path+'.json';
    this.items = [];
    this.type = type;
  }

  push(item) {
    this.items.push(item.asJSON);
    fs.writeFile(this.path, this.toJSON());
  }

  toJSON() {
    return JSON.stringify({
      data: this.items
    });
  }
}
