import Ember from 'ember';

export function truncatedString(input, options) {
	var w = options.hash.width || 20;
	if (input && input.length > w) {
		return new Ember.Handlebars.SafeString(
			input.substring(0, w - 3) + '<span data-toggle="tooltip" data-placement="auto" title="%@">...</span>'.fmt(input)
		);
	} else {
		return input;
	}
}

export default Ember.Handlebars.makeBoundHelper(truncatedString);