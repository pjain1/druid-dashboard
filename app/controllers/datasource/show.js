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
import moment from 'moment';
// import momentAsMs from 'druid-ui/utils/moment-as-ms';
import momentAsString from 'druid-ui/utils/moment-as-str';
import DruidClient from 'druid-ui/utils/druid-client';
import computed from 'ember-new-computed';

var extend = Ember.$.extend;

function computeEndTime() {
  var startTime = moment().startOf('minute');
  var theMinute = startTime.minute();
  if (theMinute < 30) {
    startTime.add(30 - theMinute, 'm');
  } else {
    startTime.add(60 - theMinute, 'm');
  }
  return startTime;
}

 var aggs = {
   aggregations: [
     DruidClient.aggs.longSum('total_value'),
     DruidClient.aggs.longSum('events')
   ],
   postAggregations: [
      DruidClient.postAggs.div('average', ['total_value', 'events'])
   ]
 };
 //var metricDisplayOrder = ['average', 'events', 'total_value'];


export default Ember.Controller.extend({

  actions: {
    tryQuery() {
      this.get('druidClient').timeSeriesQuery('wikipedia',
        '2015-04-15T16:30:00.000Z', '2015-04-16T17:30:00.000Z', 'minute');
    },
topNFilterAdded(item) {
  var filters = Ember.$.extend({}, this.get('filters'));
  if (filters[item.dim]) {
    filters[item.dim].push(item.label);
  } else {
    filters[item.dim] = [item.label];
  }
  this.set('filters', filters);
},
removeFilter(filter) {
  var filters = Ember.$.extend({}, this.get('filters'));
  var theList = filters[filter.dimension];
  debugger;
  if (theList) {
    filters[filter.dimension] = theList.filter(val => val !== filter.value );
    if (filters[filter.dimension].length === 0) {
      delete filters[filter.dimension];
    }
    this.set('filters', filters);
  }
}
  },
  queryParams: ['layoutMode', 'timeGranularity', 'sd', 'ed', 'topNRankingMetric', 'topNDimensions', 'timeSeriesMetrics'],

  druidClient: new DruidClient(),
  aggregations: computed('timeSeriesMetrics', {
    get() {
      return aggs;
/*
      {
        aggregations: this.get('timeSeriesMetrics').map( m => DruidClient.aggs.longSum(m)),
        postAggregations: []
      };
*/
    }
  }),
  timeSeriesData: computed('sd', 'ed', 'filters', 'aggregations', 'timeGranularity', {
    get() {

      var params = extend(this.baseQueryPayload(), {
        granularity: this.get('timeGranularity')
      });
      return Ember.ArrayProxy.extend({
        init() {
          this._super(...arguments);
          var client = this.get('client');

          client.timeseries(params).then(
            data => this.set('content', data)
          );
        }
      }).create({
        client: this.get('druidClient')
      });
    }
  }),
  _timeSeriesArrays: computed('timeSeriesData', 'timeSeriesData.content.[]', {
    get() {
      var data = this.get('timeSeriesData.content');
      if (Ember.isEmpty(data)) {
        return [];
      }
      var o = {};
      for (var i = 0; i < (data || []).length; i += 1) {
        var x = moment(data[i].timestamp).valueOf();
        for (var j in data[i].result) {
          var y = data[i].result[j];
          if(Ember.isEmpty(o[j])) {
            o[j] = [{y,x}];
          }
          else {
            o[j].push({y,x});
          }
        }
      }

      var arrs = [];
      for (var k in o) {
        arrs.push({
          metric: k,
          points: o[k]
        });
      }
      return arrs;
    }
  }),

  topNData: computed('sd', 'ed', 'filters', 'topNDimensions.[]', 'topNRankingMetric', {
    get() {
      var metric = this.get('topNRankingMetric');

      return this.get('topNDimensions').map(dim => {
        var params = extend(this.baseQueryPayload(), {
          granularity: 'all',
          dimension: dim,
          metric: metric,
          threshold: 10
        });
        return {
          dimension: dim,
          data: Ember.ArrayProxy.extend({
            init() {
              this._super(...arguments);

              var client = this.get('client');

              client.topN(params).then(data => {
                var results = Ember.isEmpty(data) ? [] : data[0].result.map(r => {
                  return {
                    label: r[dim],
                    value: r[metric]
                  };
                });
                this.set('content', results);
              });
            }
          }).create({
            client: this.get('druidClient')
          })
        };
      });
    }
  }),
  topNRankingMetric: 'events',
  topNDimensions: ['host', 'service', 'metric'],
  timeSeriesMetrics: ['average', 'events', 'total_value'],
  allowedMetrics: computed({
  get() {
    var aggs = this.get('aggregations');
    return aggs.aggregations.map(agg => agg.name).concat(aggs.postAggregations.map(agg => agg.name));
  }
}),
  allTimeGranularities: ['minute', 'hour', 'day'],
  filters: {},
  filterArray: computed('filters', {
    get() {
      var arr = [];
      var filters = this.get('filters');
      Ember.keys(filters).forEach(dim => {
        for (var index = 0; index < filters[dim].length; ++index) {
          arr.push({ dimension: dim, value: filters[dim][index] });
        }
      });
console.log(arr);
      return arr;
    }
  }),

  timeGranularity: 'minute',

  allLayoutModes: ['Top/Bottom','Left/Right'],
  layoutMode: 'Left/Right',

  sd: computeEndTime().subtract(8, 'h').valueOf(),
  ed: computeEndTime().valueOf(),

  startDateStr: momentAsString('sd', 'D MMMM, YYYY'),
  endDateStr: momentAsString('ed', 'D MMMM, YYYY'),

  baseQueryPayload() {
    var intervalStr = moment(this.get('sd')).toISOString() + '/' + moment(this.get('ed')).toISOString();
    return extend({
        dataSource: this.get('model.id'),
        intervals: intervalStr,
        filter: this.get('filters')
      },
      this.get('aggregations')
    );
  }
});
