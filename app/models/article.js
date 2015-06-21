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
    return this.get('id')
      .split(this.get('year')+'-').join('')
      .split(this.get('month')+'-').join('')
      .split(this.get('day')+'-').join('');
  }.property('id,year,month,day'),

  preview: function() {
    return this.get('body').split("\n\n")[0] + this.get('footnotes');
  }.property('body'),

  footnotes: function() {
    return "\n\n"+this.get('body').split("\n").map(function(line) {
      if (line.match(/\[(\w+)\]\:\shttp/)) {
        return line;
      }
    }).join("\n");
  }.property('body'),

  /**
   * @private
   */
  _splitID: function() {
    return this.get('id').split('-');
  }.property('id')
});
