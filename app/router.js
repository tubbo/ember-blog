import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('article', { path: '/:year/:month/:day/:title' });
  this.route('page', { path: '/:id' });
});

export default Router;
