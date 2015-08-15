import Ember from 'ember';

export default Ember.Component.extend({
  sortKeys: ['date:desc'],
  collection: null,
  articles: Ember.computed.sort('collection', 'sortKeys')
});
