var moment = require('moment'),
    titleize = require('titleize');

module.exports = {
  description: 'Generate an article',

  locals: function(params) {
    return {
      title: params.entity.name.split('-').join(' '),
    };
  }
};
