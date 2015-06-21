import Ember from 'ember';
import marked from 'marked';

export default Ember.Component.extend({
  src: null,
  tagName: 'div',
  classNames: ['markdown'],

  toHTML: function() {
    return marked(this.get('src'));
  }.property('src')
});
