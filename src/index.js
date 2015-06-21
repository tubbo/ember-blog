import fs from 'fs';

export default class Index {
  constructor(indexPath) {
    this.path = indexPath;
    this.articles = [];
  }

  push(article) {
    this.articles.push(article.attributes);
    fs.writeFile(this.path, JSON.stringify(this.articles), function(error) {
      if (error) { throw error; }
    });
  }
}
