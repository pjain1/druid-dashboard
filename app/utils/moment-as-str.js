import moment from 'moment';

export default function momentAsStr(key, fmt) {
	return Ember.computed(key, {
		get() {
			return moment(this.get(key)).format(fmt);
		},
		set(k, val) {
			this.set(key, moment(val).valueOf());
			return val;
		}
	})
}
