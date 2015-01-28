import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  ajax: function(url, type, options) {
    return this._super(url+'.json', type, options);
  }
});
