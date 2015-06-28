# psychedeli.ca compiler engine

This engine is used to compile static documents in `./app/articles` and
`./app/pages` to JSON representations that can be called from the
Ember.js front-end and turned into readable content.

## Usage

In **Brocfile.js**:

```javascript
import compile from 'compiler';

compile('articles');
compile('pages');
```
