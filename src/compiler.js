import frontMatter from 'front-matter';
import path from 'path';
import fs from 'fs';
import Template from './template';
import Index from './index';

export default function compile(directory) {
  let root = process.cwd(),
      index = new Index(path.join(root, 'public', directory+'.json')),
      sourcesPath = path.join(root, 'app', directory);

  fs.readdir(sourcesPath, function(dirReadError, files) {
    if (dirReadError) { throw dirReadError; }

    files.forEach(function(filename) {
      fs.readFile(path.join(sourcesPath, filename), { encoding: 'utf-8' }, function(fileReadError, contents) {
        if (fileReadError) { throw fileReadError; }

        let template = new Template(filename, contents),
            jsonPath = path.join(root, 'public', directory, template.id+'.json')

        fs.writeFile(jsonPath, template.toJSON(), { encoding: 'utf-8' }, function(error) {
          if (error) { throw error };
        });

        index.push(template);
      });
    });
  });
};
