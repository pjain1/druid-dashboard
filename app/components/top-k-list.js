import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'table',
	classNames: ['table', 'table-striped', 'top-k-list'],
	beautifyTooltips: function () {
		this.$('[data-toggle="tooltip"]').tooltip();
	},
	contentChangedObserver: function () {
		Ember.run.debounce(this, this.beautifyTooltips, 100);
	}.observes('content.[]').on('didInsertElement'),

	actions: {
		rowClicked: function (arg) {
			this.sendAction('action', {dimension: this.get('content.query.dimension'), value: arg});
		}
	}
});
