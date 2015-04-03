import Ember from 'ember';

export default Ember.Component.extend({
	allColors: ['#4CAF50', '#9C27B0', '#3F51B5',
		'#00BCD4','#F44336', '#E91E63', '#FF5722'],

	seriesData: function () {
		var i = -1;
		return (this.get('series') || []).map(
			function (x) {
				i++;
				return Ember.$.extend({color: this.get('allColors')[i]}, x);
			}.bind(this)
		);
	}.property('series')
});
