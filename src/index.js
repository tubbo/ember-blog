import fs from 'fs';

export default class Index {
  constructor(indexPath) {
    this.path = indexPath;
    this.articles = [];
  }

  push(article) {
    this.articles.push(article.attributes);
    fs.writeFile(this.path, this.toJSON(), function(error) {
      if (error) { throw error; }
    });
  }

  toJSON() {
    return JSON.stringify({ articles: this.articles })
  }
}
