/* global moment */
import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'article',
  classNames: ['article'],
  article: null,

  get title() {
    return this.article.title;
  }

  get category() {
    return new Ember.Handlebars.compile(
      '<span class="category">'+this.article.category+'</span>'
    );
  }

  get date() {
    return new Ember.Handlebars.compile(
      '<time datetime='+this._dateTime+'>'+this._humanDate+'</time>'
    );
  }

  get _dateTime() {
    return moment(this.article.publishedAt).formatDate();
  }

  get _humanDate() {
    return moment(this.article.publishedAt).distanceOfTimeInWords();
  }
});
