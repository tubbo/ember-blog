import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('view:application', 'ApplicationView');

test('initializes foundation javascript', function() {
  var view = this.subject();
  ok(view);
  view.render();
  ok(window.Foundation);
});
