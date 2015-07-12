/* global marked, Prism */
import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'article',
  classNames: ['page'],

  didInsertElement: function() {
    Prism.highlightAll();
  },

  html: function() {
    let renderer = new marked.Renderer();

    renderer.code = function(src, lang) {
      return `<pre class="language-${lang}" rel="${lang}"><code class="language-${lang}">${src}</code></pre>`;
    };

    return new Ember.Handlebars.SafeString(marked(this.get('body'), { renderer: renderer }));
  }.property('body'),

  lastUpdated: function() {
    return 'today';
  }
});
