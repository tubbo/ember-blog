import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

var application;

module('Acceptance: Article', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('render a single article', function(assert) {
  visit('/2011/08/20/a-new-beginning');

  andThen(function() {
    assert.equal(currentPath(), 'article');
    assert.notEmpty(find('article#2011-08-20-a-new-beginning'));
  });
});

test('render all article previews', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'article');
    assert.notEmpty(find('article'));
  });
});
