import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.store.find('article', { category: params.id });
  },
  setupController(controller, model) {
    controller.set('model', model);
    controller.set('categoryName', model.first().get('category'));
  }
});
