import Ember from 'ember';
import $ from 'jquery';

export default Ember.View.extend({
  /**
   * Initialize Zurb Foundation JavaScript code.
   */
  didInsertElement: function() {
    $(document).foundation();
  }
});
