import $ from 'jquery';

export default {
  name: 'foundation',
  initialize: function() {
    $(function() {
      $(document).foundation();
    });
  }
};
