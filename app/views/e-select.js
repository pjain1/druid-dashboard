import Ember from 'ember';

export default Ember.Select.extend({
	bootstrapify: function () {
		this.$().selectpicker();
	}.on('didInsertElement')
});
