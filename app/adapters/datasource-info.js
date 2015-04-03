import Ember from 'ember';
import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({

  pathForType: function () {
    return 'datasources';
  },

  ajax: function (url) {
    return this._super(...arguments).then(function (dat) {
      return {'datasource-infos': Ember.mixin({
          id: url.substring(url.lastIndexOf('/') + 1)
        }, dat)
      };
    });
  }
});
