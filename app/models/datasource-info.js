import DS from 'ember-data';

export default DS.Model.extend({
  dimensions: DS.hasManyFragments(),
  metrics: DS.hasManyFragments()
});
