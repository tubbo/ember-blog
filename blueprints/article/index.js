var dasherize = require('underscore.string/dasherize'),
    titleize = require('underscore.string/titleize'),
    moment = require('moment'),
    today = moment();

/**
 * Generates an Article in Markdown and YAML Front Matter. The file is
 * placed in `./app/articles` and will be compiled to static HTML on
 * deployment.
 */

module.exports = {
  description: 'A blog post in Markdown and YAML Front Matter.',

  date: today.format('YYYY-MM-DD'),

  anonymousOptions: [ 'name', 'category', 'tags' ],

  /**
   * Configures the entity name to be a dasherized version of the date
   * and title.
   *
   * @returns {string} a normalized filename
   */
  normalizeEntityName: function(entityName) {
    return [this.date, dasherize(entityName)].join('-');
  },

  /**
   * Generate local variables for use within the template. These
   * attributes are used to set the YAML Front Matter.
   *
   * @returns {object} key/value pairs to set local variables on the
   * template.
   */
  locals: function(options) {
    var name = options.entity.name.replace(this.date+'-', ''),
        title = name.split('-').join(' '),
        category = options.entity.options.category || 'gbs',
        tags = (options.entity.options.tags || '').split(',').join(', ');

    return {
      titleizedModuleName: title,
      todaysDate: this.date,
      category: category,
      tags: tags
    };
  }
};
