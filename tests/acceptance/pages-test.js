import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

var application;

module('Acceptance: Pages', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('render the about page', function(assert) {
  visit('/about');

  andThen(function() {
    assert.equal(currentPath(), 'page');
    assert.ok(find('.page'));
  });
});
