/* global moment */
import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'article',
  classNames: ['article'],
  page: null,

  get title() {
    return this.article.title;
  }.property('article.title'),

  get lastUpdated() {
    return new Ember.Handlebars.compile(
      '<time datetime='+this._dateTime+'>'+this._humanDate+'</time>'
    );
  }.property('humanDate,dateTime')

  get _dateTime() {
    return moment(this.page.updatedAt).formatDate();
  }

  get _humanDate() {
    return moment(this.page.updatedAt).distanceOfTimeInWords();
  }
});
