/* global moment */

import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  date: DS.attr('date'),
  category: DS.attr('string'),
  tags: DS.attr('string'),

  body: null,
  preview: null,

  formattedDate: function() {
    return moment(this.get('date')).fromNow();
  }.property('date'),

  splitID: function() {
    return this.get('id').split('-');
  }.property('id'),

  dateFromID: function() {
    var splitID = this.get('splitID');
    return [splitID[0], splitID[1], splitID[2]].join('-');
  }.property('splitID'),

  year: function() {
    return moment(this.get('dateFromID')).format('YYYY');
  }.property('dateFromID'),

  month: function() {
    return moment(this.get('dateFromID')).format('MM');
  }.property('dateFromID'),

  day: function() {
    return moment(this.get('dateFromID')).format('DD');
  }.property('dateFromID'),

  href: function() {
    return this.get('id').split(this.get('dateFromID')+'-').join('');
  }.property('id,dateFromID')
});
