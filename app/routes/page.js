import Ember from 'ember';
import $ from 'jquery';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('page', params.id);
  },

  setupController: function(controller, page) {
    $.get('/pages/'+page.get('id')+'.html', function(response) {
      var html = new Ember.Handlebars.SafeString(response);
      page.set('body', html);
    });
    controller.set('model', page);
  }
});
