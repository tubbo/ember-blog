import path from 'path';
import fs from 'fs';
import Template from './template';
import Index from './index';

export default function compile(directory) {
  let root = process.cwd(),
      source = path.join(root, 'app', directory),
      destination = path.join(root, 'public', directory),
      index = new Index(destination);

  fs.mkdir(destination, function(error) {
    if (error) {
      //console.log(destination, 'exists so didnt mkdir');
    }
  });

  fs.readdir(source, function(dirReadError, files) {
    if (dirReadError) { throw dirReadError; }

    files.forEach(function(filename) {
      fs.readFile(path.join(source, filename), { encoding: 'utf-8' }, function(fileReadError, contents) {
        if (fileReadError) { throw fileReadError; }

        let template = new Template(filename, contents, destination);

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
