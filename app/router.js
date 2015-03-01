import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType,
  notifyAnalytics: function() {
    return ga.send('pageview', {
      'poge': this.get('url'),
      'title': (this.get('title') || this.get('url'))
    });
  }.on('didTransition')
});

Router.map(function() {
  this.route('article', { path: '/:year/:month/:day/:title' });
  this.route('page', { path: '/:id' });
});

export default Router;
