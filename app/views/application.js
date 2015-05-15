import Ember from 'ember';

export default Ember.View.extend({
  bootFoundation: function() {
    this.$().foundation();
  }.on('didInsertElement')
});
