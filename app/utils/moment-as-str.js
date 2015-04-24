import Ember from 'ember';
import moment from 'moment';

export default function momentAsStr(key, fmt) {
	return Ember.computed(key, {
		get() {
      var m = moment(Ember.get(this, key));
      if (!m.isValid()) {
        throw `Invalid date: ${key} -- ${this.get(key)}`;
      }
			return m.format(fmt);
		},
		set(k, val) {
			this.set(key, moment(val).valueOf());
			return val;
		}
	});
}
