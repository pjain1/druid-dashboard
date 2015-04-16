import Ember from 'ember';
import moment from 'moment';

export default function momentAsMs(prop) {
  return Ember.computed(prop, {
  	get() {
  		return this.get(prop).valueOf();
  	},
  	set(key, val) {
     	this.set(prop, moment(val));
      	return val;
  	}
  });
}
