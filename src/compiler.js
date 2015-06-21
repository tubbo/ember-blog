import frontMatter from 'front-matter';
import path from 'path';
import fs from 'fs';

export default function compile(directory) {
  let index = [],
      tree = [],
      root = process.cwd(),
      indexPath = path.join(root, 'public', directory+'.json');

  fs.readDir(path.join(root, 'app', directory, '*.md'), function(error, file) {
    if (error) { throw error; }

    fs.readFile(file, function(error, contents) {
      if (error) { throw error; }

      var yaml = frontMatter(contents),
          article = Object.assign(yaml.attributes, { body: yaml.body }),
          id = path.basename(file, '.md'),
          jsonPath = path.join(root, 'public', directory, id+'.json');

      fs.writeFile(jsonPath, article.toJSON());
      tree.push(jsonPath);
      index.push(article);
    });
  });

  fs.writeFile(indexPath, index.toJSON());
};
