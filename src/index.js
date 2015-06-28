import fs from 'fs';

/**
 * Contains a collection of Template objects and writes them as an index
 * to disk.
 */
export default class Index {
  /**
   * @constructor
   * @param {string} path The path to this JSON index.
   * @param {string} type The type of this JSON index, used for the dir.
   */
  constructor(path, type) {
    this.path = path+'.json';
    this.items = [];
    this.type = type;
  }

  /**
   * Add a Template to the index.
   *
   * @param {Template} item A document to be added to the index.
   */
  push(item) {
    this.items.push(item.asItem);
    save();
  }

  /**
   * Writes a JSON representation of the index to disk.
   *
   * @throws {Exception} if the file can't be written
   */
  compile() {
    fs.writeFile(this.path, this.toJSON());
  }

  /**
   * Output all templates as JSON.
   *
   * @returns {string}
   */
  toJSON() {
    return JSON.stringify({
      data: this.items
    });
  }
}
