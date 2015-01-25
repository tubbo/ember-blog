import dasherize, titleize from 'sugar';
import moment from 'moment';

/**
 * Generates an Article in Markdown and YAML Front Matter.
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
    var date = moment().format('YYYY-DD-MM'),
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
      todaysDate: moment().format(),
      defaultCategory: 'gbs'
    }
  }
};
