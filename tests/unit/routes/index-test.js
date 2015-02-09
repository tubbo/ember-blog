import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('route:index', 'IndexRoute', {
});

test('loads preview content into body attribute', function() {
  var route = this.subject();
  ok(route.get('model'));
});
