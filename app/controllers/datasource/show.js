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
    DruidClient.aggs.longSum('clicks'),
    DruidClient.aggs.doubleSum('impressions')
  ],
  postAggregations: [
    // DruidClient.postAggs.div('clicks', ['total_value', 'events']),
    // DruidClient.postAggs.div('impressions', ['total_value', 'events'])
  ]
};
// var metricDisplayOrder = ['average', 'events', 'total_value'];


export default Ember.Controller.extend({

  actions: {
    tryQuery() {
      this.get('druidClient').timeSeriesQuery('wikipedia',
        '2015-04-15T16:30:00.000Z', '2015-04-16T17:30:00.000Z', 'minute');
    }
  },
  queryParams: ['layoutMode', 'timeGranularity', 'sd', 'ed'],

  druidClient: new DruidClient(),

  timeSeriesData: Ember.computed('timeGranularity', {
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
  _timeSeriesArrays: Ember.computed('timeSeriesData', 'timeSeriesData.content.[]', {
    get() {
      var data = this.get('timeSeriesData.content');
      if (Ember.isEmpty(data)) {
        return [];
      }
      var o = {};
      for (var i = 0; i < (data || []).length; i += 1) {
        var x = moment(data[i].timestamp).unix();
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

  topNData: Ember.computed('model.dimensions', 'topNRankingMetric', {
    get() {
      var metric = this.get('topNRankingMetric');

      return this.get('model.dimensions').map(dim => {
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
  topNRankingMetric: 'clicks',
  allTimeGranularities: ['minute', 'hour', 'day'],
  timeGranularity: 'minute',

  allLayoutModes: ['Top/Bottom','Left/Right'],
  layoutMode: 'Left/Right',

  sd: computeEndTime().subtract(3, 'd').valueOf(),
  ed: computeEndTime().valueOf(),

  startDateStr: momentAsString('sd', 'D MMMM YYYY'),
  endDateStr: momentAsString('ed', 'D MMMM YYYY'),

  baseQueryPayload() {
    return extend({
        dataSource: this.get('model.id'),
        intervals: moment(this.get('sd')).toISOString() + '/' + moment(this.get('endDate')).toISOString()
      },
      aggs
    );
  }
});
