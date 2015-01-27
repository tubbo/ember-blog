import Ember from 'ember';
//import moment from 'moment';

export default Ember.ObjectController.extend({
  lastModified: function() {
    return 'just now';
  }.property()
});
