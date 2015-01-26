import resolver from './helpers/resolver';
import { setResolver } from 'ember-qunit';
import $ from 'jquery';

setResolver(resolver);

$('body').append(
  $('<div id="ember-testing-container"><div id="ember-testing"></div></div>')
);

QUnit.config.urlConfig.push({ id: 'nocontainer', label: 'Hide container'});
var containerVisibility = QUnit.urlParams.nocontainer ? 'hidden' : 'visible';
$('#ember-testing-container').css({ visibility: containerVisibility });
