/* global moment */

module.exports = {
  description: 'Generate an article',

  locals: function(options) {
    let date = moment().format('YYYY-MM-DD');

    return {
      name: options.name,
      category: options.category,
      date: date,
      tags: options.tags
    };
  }
};
