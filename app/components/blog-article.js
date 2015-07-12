/* global marked, moment, Prism */
import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'article',
  classNames: ['article'],

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

  postedAt: function() {
    return moment(this.get('date')).fromNow();
  }.property('date'),
});
