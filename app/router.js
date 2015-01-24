import Ember from 'ember';
import DocumentTitle from 'ember-document-title';
import config from './config/environment';

var Router = Ember.Router.extend(DocumentTitle, {
  location: config.locationType
});

Router.map(function() {
  this.route('about', { path: '/about' });
  this.route('article', { path: '/:year/:month/:day/:title' });
});

export default Router;
