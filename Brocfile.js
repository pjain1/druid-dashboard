/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp();
app.import('bower_components/ember/ember-template-compiler.js');
app.import('bower_components/d3/d3.js');
app.import('bower_components/lodash/lodash.js');

app.import('bower_components/nvd3/build/nv.d3.js');
app.import('bower_components/nvd3/build/nv.d3.css');
app.import('bower_components/bootstrap/dist/css/bootstrap.css');
app.import('bower_components/bootstrap/dist/js/bootstrap.js');


app.import('bower_components/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css');
app.import('bower_components/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js');
app.import('bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff', {
  destDir: 'fonts'
});
app.import('bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2', {
  destDir: 'fonts'
});

app.import('bower_components/bootstrap-select/dist/css/bootstrap-select.css');
app.import('bower_components/bootstrap-select/dist/js/bootstrap-select.js');
app.import('bower_components/bootstrap-select/dist/css/bootstrap-select.css.map', {
	destDir: 'assets'
});
// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

module.exports = app.toTree();
