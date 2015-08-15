import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  /**
   * Extend the JSON API adapter to use the +.json+ file extension so
   * that the static JSON files are found.
   *
   * @param string modelName
   * @param string id
   */
  _buildURL: function(modelName, id) {
    return this._super(modelName, id) + '.json';
  },

  shouldReloadAll: function() { return true; }
});
