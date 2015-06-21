'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = compile;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _frontMatter = require('front-matter');

var _frontMatter2 = _interopRequireDefault(_frontMatter);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function compile() {
  arguments.forEach(function (directory) {
    var index = [],
        tree = [],
        indexPath = _path2['default'].join('root', 'public', directory + '.json');

    _fs2['default'].readDir(_path2['default'].join(root, 'app', directory, '*.md'), function (error, file) {
      if (error) {
        throw error;
      }

      _fs2['default'].readFile(file, function (error, contents) {
        if (error) {
          throw error;
        }

        var yaml = (0, _frontMatter2['default'])(contents),
            article = Object.assign(yaml.attributes, { body: yaml.body }),
            id = _path2['default'].basename(file).split('.md').join(''),
            jsonPath = _path2['default'].join(root, 'public', directory, id + '.json');

        _fs2['default'].writeFile(jsonPath, article.toJSON());
        tree.push(jsonPath);
        index.push(article);
      });
    });

    _fs2['default'].writeFile(indexPath, index.toJSON());
  });
}

;
module.exports = exports['default'];
