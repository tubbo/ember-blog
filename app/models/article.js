import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  date: DS.attr('date'),
  category: DS.attr('string'),
  tags: DS.attr('array'),
  body: null
});
