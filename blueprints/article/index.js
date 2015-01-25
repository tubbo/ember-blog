var dasherize = require('sugar/dasherize'),
    titleize = require('sugar/titleize'),
    moment = require('moment'),
    today = moment();

/**
 * Generates an Article in Markdown and YAML Front Matter. The file is
 * placed in `./app/articles` and will be compiled to static HTML on
 * deployment.
 */

module.exports = {
  description: 'A blog post in Markdown and YAML Front Matter.',

  /**
   * Configures the entity name to be a dasherized version of the date
   * and title.
   *
   * @returns {string} a normalized filename
   */
  normalizeEntityName: function(entityName) {
    var date = today.format('YYYY-DD-MM'),
        name = dasherize(entityName);

    return [date, time].join('-');
  },

  /**
   * Generate local variables for use within the template. These
   * attributes are used to set the YAML Front Matter.
   *
   * @returns {object} key/value pairs to set local variables on the
   * template.
   */
  locals: function(options) {
    return {
      titleizedModuleName: titleize(classifiedModuleName),
      todaysDate: today.format(),
      defaultCategory: 'gbs'
    }
  }
};
