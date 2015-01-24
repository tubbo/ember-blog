import Ember from 'ember';
import $ from 'jquery';

export default Ember.Route.extend({
  title: Ember.computed.reads('controller.title'),

  model: function(params) {
    var id = [
      params.year,
      params.month,
      params.day,
      params.title
    ].join('-');

    return this.store.find('article', id);
  },

  controller: function(controller, article) {
    controller.model = article;

    $.get('/articles/'+controller.model.id+'.html', function(response) {
      controller.model.set('body', response);
    });
  }
});
