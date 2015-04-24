import Ember from 'ember';
import computed from 'ember-new-computed';

export default Ember.Component.extend({
  classNames: ['druid-top-n-list'],
  title: computed('dimension', 'rankingMetric', {
    get() {
      return `Top ${this.get('dimension')} by ${this.get('rankingMetric')}`;
    }
  })
});
