import {
  moduleFor,
  test
} from 'ember-qunit';
import Ember from 'ember';

moduleFor('view:application', 'ApplicationView');

test('initializes zurb foundation', function() {
  ok(this.subject());
});
