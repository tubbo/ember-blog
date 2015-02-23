import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    this.articleID = [
      params.year,
      params.month,
      params.day,
      params.title
    ].join('-');
    return this.store.find('article', this.articleID);
  },
  afterModel: function(article) {
    var url = '/articles/'+this.articleID+'.html';
    Ember.$.get(url, function(html) {
      article.set('body', new Ember.Handlebars.SafeString(html));
    });
  }
});
