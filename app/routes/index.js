import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.find('article');
  },

  afterModel: function(model) {
    model.forEach(function(article) {
      Ember.$.get('/articles/'+article.get('id')+'.preview.html', function(html) {
        article.set('body', new Ember.Handlebars.SafeString(html));
      });
    });
  }
});
