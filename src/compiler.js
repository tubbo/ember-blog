import path from 'path';
import fs from 'fs';
import inflectors from 'inflectors';
import Template from './template';
import Index from './index';

export default function compile(directory) {
  let root = process.cwd(),
      type = inflectors.singularize(directory),
      source = path.join(root, 'app', directory),
      destination = path.join(root, 'public', directory),
      index = new Index(destination, directory);

  fs.mkdir(destination, function(error) {
    // swallow errors
  });

  fs.readdir(source, function(dirReadError, files) {
    if (dirReadError) { throw dirReadError; }

    files.forEach(function(filename) {
      fs.readFile(path.join(source, filename), { encoding: 'utf-8' }, function(fileReadError, contents) {
        if (fileReadError) { throw fileReadError; }

        let template = new Template(filename, contents, destination, type);

        if (template.publishable) {
          template.compile();
          index.push(template);
        } else {
          console.warn("Template", template.id, "will not be published.");
        }
      });
    });
  });
};
