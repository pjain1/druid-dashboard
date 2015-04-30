import Ember from 'ember';
import computed from 'ember-new-computed';

export default Ember.Component.extend({
  classNames: ['druid-top-n-list'],
  actions: {
    itemClicked(item) {
      this.container.lookup('controller:datasource/show').send('topNFilterAdded', Ember.$.extend({}, item, {dim: this.get('dimension')}));
    }
  },
  title: computed('dimension', 'rankingMetric', {
    get() {
      return `Top ${this.get('dimension')} by ${this.get('rankingMetric')}`;
    }
  })
});
