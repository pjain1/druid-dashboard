import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['druid-top-n-list'],
  title: Ember.computed('dimension', 'rankingMetric', {
    get() {
      return `Top ${this.get('dimension')} by ${this.get('rankingMetric')}`;
    }
  })
});
