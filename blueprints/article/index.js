var moment = require('moment'),
    titleize = require('titleize');

module.exports = {
  description: 'Generate an article',

  date: moment().format('YYYY-MM-DD'),

  availableOptions: [
    { name: 'category', type: String, default: 'gbs' },
    { name: 'tags', type: Array, default: [] }
  ],

  fileMapTokens: function() {
    var task = this;
    return {
      __date__: function(options) {
        return task.date;
      }
    }
  },

  locals: function(params) {
    return {
      title: params.entity.name.split('-').join(' '),
      date: this.date,
      category: params.taskOptions.category,
      tags: params.taskOptions.tags.join(', ')
    };
  }
};
