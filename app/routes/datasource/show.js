import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    datasource: {
      refreshModel: true,
    }
  },

  model: function (params) {
    return this.store.find('datasource-info', params.id);
  }
});
