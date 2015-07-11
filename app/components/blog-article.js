/* global marked, moment */
import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'article',
  classNames: ['article'],

  html: function() {
    return new Ember.Handlebars.SafeString(marked(this.get('body')));
  }.property('body'),

  postedAt: function() {
    return moment(this.get('date')).fromNow();
  }.property('date'),
});
