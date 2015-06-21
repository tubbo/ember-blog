import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  date: DS.attr('date'),
  category: DS.attr('string'),
  tags: DS.attr('string'),
  body: DS.attr('string'),

  year: function() {
    return this.get('_splitID')[0];
  }.property('_splitID'),

  month: function() {
    return this.get('_splitID')[1];
  }.property('_splitID'),

  day: function() {
    return this.get('_splitID')[2];
  }.property('_splitID'),

  href: function() {
    return this.get('_splitID')[3];
  }.property('_splitID'),

  /**
   * @private
   */
  _splitID: function() {
    return this.get('id').split('-');
  }.property('id')
});
