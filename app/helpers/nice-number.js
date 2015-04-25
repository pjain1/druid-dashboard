import Ember from 'ember';

export function niceNumber(params/*, hash*/) {
  var num = params[0];
  // Ember.assert(Ember.typeOf(num) === 'number', 'argument must be a number');
  var formattedNum = null;
  if (num >= 1000 && num < 1000000) {
    formattedNum = `${Math.round(num/100)/10}K`;
  }
  else if (num >= 1000000 && num < 1000000000) {
    formattedNum = `${Math.round(num/100000)/10}M`;
  }
  else if (num >= 1000000000) {
    formattedNum = `${Math.round(num/100000000)/10}B`;
  }
  else {
    formattedNum = '' + num;
  }
  return new Ember.Handlebars.SafeString(formattedNum);

}

export default Ember.HTMLBars.makeBoundHelper(niceNumber);
