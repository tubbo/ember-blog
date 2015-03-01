import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.find('article');
  },

  afterModel: function(model) {
    this.set('title', 'articles');
    model.forEach(function(article) {
      var url = '/articles/'+article.get('id')+'.preview.html';
      Ember.$.get(url, function(html) {
        article.set('body', new Ember.Handlebars.SafeString(html));
      });
    });
  }
});
