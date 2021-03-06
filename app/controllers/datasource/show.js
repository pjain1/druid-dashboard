/*
 * Copyright (c) 2015 Yahoo Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Ember from 'ember';
import Moment from 'moment';
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


var aggs = {
  aggregations: [
    druidClient.aggs.longSum('events'),
    druidClient.aggs.doubleSum('total_value')
  ],
  postAggregations: [
    druidClient.postAggs.div('average', ['total_value', 'events'])
  ]
};
var metricDisplayOrder = ['average', 'events', 'total_value'];

function buildFilter(dim, vals) {
  function makeSelector(val) {
    return { type: 'selector', dimension: dim, value: val };
  }

  if (Array.isArray(vals)) {
    if (vals.length === 1) {
      return makeSelector(vals[0]);
    }
    return { type: 'or', fields: vals.map(makeSelector) };
  } else {
    makeSelector(vals);
  }
}

function doQuery() {
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

var TopKObject = Ember.ObjectProxy.extend({
  getData: function ()
  {
    var self = this;
    var dim = this.query.dimension;
    var metric = this.query.metric;

    doQuery(
      {
        queryType: 'topN',
        granularity: 'all',
        dataSource: this.datasource,
        threshold: 10
      },
      aggs,
      this.query
    ).then( val => {
      var retVal = {title: dim, data: []};
      if (val.length > 0) {
        retVal.data = val[0].result.map(
          res => ({ label: res[dim], amount: res[metric] })
        );
      }
      return retVal;
    }).then( val => {
      self.set('content', val);
    });
  }
});

var TimeseriesObject = Ember.ObjectProxy.extend({
  getData: function ()
  {
    var self = this;
    doQuery(
      {
        queryType: 'timeseries',
        dataSource: this.datasource
      },
      aggs,
      this.query
    ).then( val => {
      var retVal = { data:[] };
      if (val.length > 0) {
        retVal.data = metricDisplayOrder.map( metric => {
          return {
            label: metric,
            dimensions: ['time', metric],
            data: val.map( res => {
              var v = {
                time: res.timestamp
              };
              v[metric] = res.result[metric];
              return v;
            })
          };
        });
      }
      return retVal;
    }).then( val => {
      self.set('content', val);
    });
  }
});  

var TypeAheadObject = Ember.ObjectProxy.extend({
  populateTypeAheadList: function (arg) {
    var defferedArg = arg;
    doQuery({
        queryType: 'search',
        dataSource: this.datasource
    }, this.query).then( val => {
      var retVal = { data:[] };
      if (val.length > 0) {
        retVal.data = val.map( res => {
          return res.result.map(
            result => ({ "id": result.value, "text": result.value })
          );
        });
      }
      return retVal;
    }).then( finalResult =>
      { return defferedArg.resolve(finalResult.data[0]); }
    );
  }
});

function momentAsMs(prop) {
  return Ember.computed(prop, function(key, val) {
    if (arguments.length > 1) {
      // setter
      var v = new Moment(val);
      this.set(prop, v);
      return v;
    }
    else {
      // getter
      return this.get(prop).valueOf();
    }
  });
}

function computeEndTime() {
  var startTime = new Moment().startOf('minute');
  var theMinute = startTime.minute();
  if (theMinute < 30) {
    startTime.add(30 - theMinute, 'm');
  } else {
    startTime.add(60 - theMinute, 'm');
  }
  return startTime;
}

export default
Ember.Controller.extend(
  {
    queryParams: ['dashLayout', 'timeGranularity', 'sd', 'ed'],
    layoutModes: ['top-bottom', 'left-right'],
    dashLayout: 'left-right',

    isColumnLayout: Ember.computed.equal('dashLayout', 'left-right'),

    startDate: computeEndTime().subtract(1, 'h'),
    endDate: computeEndTime(),

    interval: function() {
      return this.get('startDate').toISOString() + '/' + this.get('endDate').toISOString();
    }.property('startDate', 'endDate'),

    sd: momentAsMs('startDate'),
    ed: momentAsMs('endDate'),


    allTimeGranularities: ['minute', 'hour', 'day'],
    timeGranularity: 'minute',

    availableMetrics: metricDisplayOrder,
    metric: metricDisplayOrder[0],

    dimensionFilters: {},
    filters: [],
    runCount: 0,

    actions: {
      topKRowClicked: function (info) {
        var filtersForThisDimensionKey = 'dimensionFilters.%@'.fmt(info.dimension);
        var currArr = this.get(filtersForThisDimensionKey);
        if (currArr == null) {
          currArr = [info.value];
        }
        else {
          currArr.pushObject(info.value);
        }
        this.set(filtersForThisDimensionKey, currArr);
        var filters = this.get('dimensionFilters');
        this.set(
          'filters',
          Object.keys(filters)
            .filter((e) => ( filters[e] != null))
            .map((key) => ({dim: key, val: filters[key][0]}))
        );

        Ember.run.debounce(this, this.refreshDataAfterFilterChange, 700/*ms*/);
      },

      filterClicked: function(dim) {
        var filtersForThisDimensionKey = 'dimensionFilters.%@'.fmt(dim);
        this.set(filtersForThisDimensionKey, null);
        var filters = this.get('dimensionFilters');
        this.set(
          'filters',
          Object.keys(filters)
            .filter((e) => (filters[e] != null))
            .map((key) => ({dim: key, val: filters[key][0]}))
        );

        Ember.run.debounce(this, this.refreshDataAfterFilterChange, 700/*ms*/);

      },

      searchDimension: function(dimSearchArgs) {
        Ember.run.debounce(this, this.typeAheadList, dimSearchArgs, 200/*ms*/);
      }

    },

    refreshDataAfterFilterChange: function () {
      this.incrementProperty('runCount');
    },

    timeDurationInMs: function () {
        return this.get('endDate').valueOf() - this.get('startDate').valueOf();
    }.property('startDate', 'endDate'),

    timeseriesData: function() {
      if (Ember.isEmpty(this.get('model.id'))) {
        return null;
      }
      var retVal = TimeseriesObject.create(
        {
          datasource: this.get('model.id'),
          query: {
            granularity: this.get('timeGranularity'),
            intervals: this.get('interval'),
            filter: this.get('dimensionFilters')
          }
        }
      );
      retVal.getData();
      return retVal;
    }.property('timeGranularity', 'interval', 'runCount'),

    topKData: function () {
      if (Ember.isEmpty(this.get('model.id'))) {
        return null;
      }
      return this.get('model.dimensions.content').map(
        function (dim)
        {
          var retVal = TopKObject.create(
            {
              datasource: this.get('model.id'),
              query: {
                dimension: dim,
                metric: this.get('metric'),
                intervals: this.get('interval'),
                filter: this.get('dimensionFilters')
              }
            }
          );
          retVal.getData();
          return retVal;
        }.bind(this)
      );

    }.property('model.dimensions.[]', 'runCount', 'interval', 'metric'),

    typeAheadList: function (arg) {
      var searchDimension = arg.dimName;
      var searchValue = arg.dimValue;
      var deffered = arg.deffered;
      var typeAheadObj = TypeAheadObject.create({
        datasource: this.get('model.id'),
        query: {
          granularity: 'all',
          intervals: this.get('interval'),
          filter: this.get('dimensionFilters'),
          searchDimensions: [ searchDimension ],
          limit: 50,
          query: {
            type: "insensitive_contains",
            value: searchValue
          }
        }
      });
      typeAheadObj.populateTypeAheadList(deffered);
    }
  }
);
