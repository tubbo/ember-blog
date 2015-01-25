import Ember from 'ember';
import Ember.GoogleAnalyticsTrackingMixin from 'ember-google-analytics';
import config from './config/environment';

var Router = Ember.Router.extend(Ember.GoogleAnalyticsTrackingMixin, {
  location: config.locationType
});

Router.map(function() {
  this.route('about', { path: '/about' });
  this.route('article', { path: '/:year/:month/:day/:title' });
});

export default Router;
