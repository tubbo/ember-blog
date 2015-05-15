import DS from 'ember-data';
import Ember from 'ember';

export default DS.RESTAdapter.extend({
  ajax: function(url, type, options) {
    return this._super(url+'.json', type, options);
  },

  find: function(store, type, id, record) {
    var resource = this._super(store, type, id, record);
    this._content(type, record, 'html');
    return resource;
  },

  _content: function(type, record, format) {
    var url = [this.buildURL(type.typeKey, record.id, record), format].join('.');


    Ember.$.get(url, function(html) {
      record.set('body', new Ember.Handlebars.SafeString(html));
    });
  }
});
