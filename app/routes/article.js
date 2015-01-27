import Ember from 'ember';
import $ from 'jquery';

export default Ember.Route.extend({
  title: Ember.computed.reads('controller.title'),

  model: function(params) {
    return this.store.find('article', this._resolveArticleID(params));
  },

  setupController: function(controller, article) {
    $.get('/articles/'+article.get('id')+'.html', function(html) {
      article.set('body', new Ember.Handlebars.SafeString(html));
    });
    controller.set('model', article);
  },

  _resolveArticleID: function(params) {
    return [
      params.year,
      params.month,
      params.day,
      params.title
    ].join('-');
  }
});
