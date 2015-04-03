import Ember from 'ember';
import Moment from 'moment';

export default Ember.Component.extend({
	startup: function () {
		var m = this.get('content');
		this.$('.form_datetime input').val(m.format('YYYY-MM-DD HH:mm'));

		this.$('.form_datetime input').on('change', function (evt) {
			this.set('content', new Moment(evt.target.value));
		}.bind(this));
		this.$('.form_datetime').datetimepicker({
			autoclose: true,
			todayBtn: true,
			format: 'yyyy-mm-dd hh:ii'
		});
		this.$('.form_datetime').datetimepicker('update');
	}.on('didInsertElement')
});
