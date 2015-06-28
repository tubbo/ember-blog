import Ember from 'ember';

export default Ember.Route.extend({
  shouldBackgroundReloadRecord: false,
  model: function(params) {
    let articleID = [
      params.year,
      params.month,
      params.day,
      params.title
    ].join('-');
    return this.store.findRecord('article', articleID);
  }
});
