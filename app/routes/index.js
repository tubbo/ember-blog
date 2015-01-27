import Ember from 'ember';
import $ from 'jquery';

export default Ember.Route.extend({
  model: function() {
    return this.store.find('article');
  },

  setupController: function(controller, articles) {
    articles.forEach(function(article) {
      $.get('/articles/'+article.get('id')+'.preview.html', function(html) {
        article.set('body', new Ember.Handlebars.SafeString(html));
      });
    });

    controller.set('model', articles);
  }
});
