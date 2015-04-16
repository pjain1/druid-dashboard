import Ember from 'ember';
import ajax from 'ic-ajax';


function metricSpec(type, field, name) {
  return {type: type, fieldName: field, name: name == null ? field: name};
}

var druidClient = {
  aggs: {
    metricSpec: metricSpec,
    longSum: metricSpec.bind(null, 'longSum'),
    doubleSum: metricSpec.bind(null, 'doubleSum')
  },
  postAggs: {
    div: function(name, fields) {
      var theFields = fields.map(
        function(val){
          if (typeof val === 'string') {
            return this.field(val);
          }
          return val;
        }.bind(this)
      );
      return {type: "arithmetic", name: name, fn: "/", fields: theFields};
    },
    field: function(name) {
      return {type: "fieldAccess", fieldName: name, name: name};
    }
  }
};


export var aggs = {
  aggregations: [
    druidClient.aggs.longSum('events'),
    druidClient.aggs.doubleSum('total_value')
  ],
  postAggregations: [
    druidClient.postAggs.div('average', ['total_value', 'events'])
  ]
};


export function doQuery() {
  var query = Ember.$.extend.apply(null, [{}].concat(Array.prototype.slice.call(arguments, 0)));

  if (query.filter != null) {
    var filters = Object.keys(query.filter)
      .filter(function(key){ return query.filter[key] != null; })
      .map(function(toFilter) {
                               return buildFilter(toFilter, query.filter[toFilter]);
                             });

    switch (filters.length) {
      case 0:
        query.filter = null;
        break;
      case 1:
        query.filter = filters[0];
        break;
      default:
        query.filter = {type: 'and', fields: filters};
    }
  }
  return ajax(
    '/druid/v2/?queryType=' + query.queryType,
    {
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(query),
      dataType: 'json'
    }
  );
}
