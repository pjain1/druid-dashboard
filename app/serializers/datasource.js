import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  normalizePayload: function (rawPayload) {
    return {datasources: rawPayload.map((x) => ({id: x})) };
  }
});
