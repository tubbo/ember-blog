import DS from 'ember-data';
import Ember from 'ember';

//var get = Ember.get;
//var forEach = Ember.ArrayPolyfills.forEach;

export default DS.RESTAdapter.extend({
  ajax: function(url, type, options) {
    var adapter = this;
    url = url + '.json';

    return new Ember.RSVP.Promise(function(resolve, reject) {
      var hash = adapter.ajaxOptions(url, type, options);

      hash.success = function(json, textStatus, jqXHR) {
        json = adapter.ajaxSuccess(jqXHR, json);

        if (json instanceof DS.InvalidError) {
          Ember.run(null, reject, json);
        } else {
          Ember.run(null, resolve, json);
        }
      };

      hash.error = function(jqXHR, textStatus, errorThrown) {
        Ember.run(null, reject, adapter.ajaxError(jqXHR, jqXHR.responseText, errorThrown));
      };

      Ember.$.ajax(hash);
    }, 'DS: RESTAdapter#ajax ' + type + ' to ' + url);
  },
});
