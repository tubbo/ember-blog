/**
 * Top-level namespace for compiler stuff.
 */

module.exports = {
  Collection: require('./compiler/collection'),
  Template: require('./compiler/template'),
  build: function(key) {
    var collection = new this.Collection({ key: key });
    console.log('Compiling', collection.source, 'to', collection.destination+'...');

    return collection;
  }
};
