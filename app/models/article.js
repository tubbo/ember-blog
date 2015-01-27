import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  title: DS.attr('string'),
  date: DS.attr('date'),
  category: DS.attr('string'),
  tags: DS.attr('string'),
  body: new Ember.Handlebars.SafeString('<span class="loading">Loading Content...</span>'),

  _splitID: function() {
    return this.get('id').split('-');
  }.property('id'),

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
    return this.get('_splitID').splice(3, this.get('_splitID').length-1).join('-');
  }.property('_splitID'),

  formattedDate: function() {
    return moment(this.get('date')).fromNow();
  }.property('date'),

  permalink: function() {
    var year = this.get('year'),
        month = this.get('month'),
        day = this.get('day'),
        title = this.get('href').split(' ').join('-');

    return [year,month,day,title].join('/');
  }.property('id')
});
