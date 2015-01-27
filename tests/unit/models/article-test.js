import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('article', 'Article', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});

/*test('has a default body', function() {
  ok(this.subject.get('body'));
});

test('computes the permalink', function() {
  equal('/2000/01/01/article-title', this.subject.get('permalink'));
});*/
