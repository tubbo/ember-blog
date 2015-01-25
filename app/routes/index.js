import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var query = this.store.find('article');
    return (query.content) ? query : [];
  }
});
