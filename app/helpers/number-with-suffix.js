import Ember from 'ember';

export function numberWithSuffix(inputString) {
	var input = parseInt(inputString, 10);
	Ember.assert("Missing required maxValue argument", input === 0 || !Ember.isEmpty(input));
	var result = '';
	if (input > 1000 && input < 1000000) {
		result = '%@<span class="suffix">K</span>'.fmt(Math.round(input/1000));
	}
	else if (input > 1000000 && input < 1000000000) {
		result = '%@<span class="suffix">M</span>'.fmt(Math.round(input/1000000));
	}
	else if (input > 1000000000) {
		result = '%@<span class="suffix">B</span>'.fmt(Math.round(input/1000000000));
	}
	else {
		result = input;
	}

  return new Ember.Handlebars.SafeString(result);
}

export default Ember.Handlebars.makeBoundHelper(numberWithSuffix);
