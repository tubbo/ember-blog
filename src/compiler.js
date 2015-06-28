import path from 'path';
import fs from 'fs';
import Template from './template';
import Index from './index';

/**
 * Top-level function for compiling a directory of static pages. Takes
 * one argument that specifies which directory in +app/+ it will be
 * compiling.
 *
 * @param string directory - a directory in app/ that contains static
 * pages.
 */
export default function compile(directory) {
  let root = process.cwd(),
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

        let template = new Template(filename, contents, destination, directory);

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
