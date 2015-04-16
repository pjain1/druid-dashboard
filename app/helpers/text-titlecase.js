import Ember from 'ember';

export function textTitlecase(params/*, hash*/) {
  Ember.assert(Ember.typeOf(params[0]) === 'string', 'First argument must be a string');
  var str = params[0];
  return new Ember.Handlebars.SafeString(str[0].toUpperCase() + str.substring(1).toLowerCase());
}

export default Ember.HTMLBars.makeBoundHelper(textTitlecase);
