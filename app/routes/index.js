import Ember from 'ember';

export default Ember.Route.extend({
  shouldBackgroundReloadAll: false,
  model() {
    return this.store.findAll('article');
  }
});
