/* global moment */
import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'article',
  classNames: ['article'],
  article: null,

  title: function() {
    return this.get('article').get('title');
  }.property('article.title'),

  category: function() {
    return this.get('article').get('category');
  }.property('article.category'),

  date: function() {
    return moment(this.get('publishedAt')).fromNow();
  }.property('_publishedAt'),

  dateTime: function() {
    return moment(this.get('_publishedAt')).toISO();
  }.property('_publishedAt'),

  _publishedAt: function() {
    return this.get('article').get('date');
  }.property('article.date')

});
