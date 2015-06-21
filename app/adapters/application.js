import DS from 'ember-data';

export default DS.ActiveModelAdapter.extend({
  _buildURL: function(modelName, id) {
    return this._super(modelName, id) + '.json';
  }
});
