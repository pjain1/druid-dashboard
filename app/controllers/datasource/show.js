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
import momentAsMs from 'druid-ui/utils/moment-as-ms';
import momentAsString from 'druid-ui/utils/moment-as-str';
import DruidClient from 'druid-ui/utils/druid-client';

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

var aggs = {
  aggregations: [
    DruidClient.aggs.longSum('events'),
    DruidClient.aggs.doubleSum('total_value')
  ],
  postAggregations: [
    DruidClient.postAggs.div('average', ['total_value', 'events'])
  ]
};
var metricDisplayOrder = ['average', 'events', 'total_value'];


export default Ember.Controller.extend({

  actions: {
    tryQuery: function () {
      this.get('druidClient').timeSeriesQuery('wikipedia',
    '2015-04-15T16:30:00.000Z', '2015-04-16T17:30:00.000Z', 'minute');
    }
  },
	queryParams: ['layoutMode', 'timeGranularity', 'sd', 'ed'],

  druidClient: new DruidClient(),

  timeSeriesData: Ember.computed({
    get() {

      var params = _.extend(this.baseQueryPayload(), { granularity: 'minute' } );
      return Ember.ArrayProxy.extend({
        init: function () {
          this._super(...arguments);
          var client = this.get('client');

          client.timeseries(params).then(
            data => this.set('content', data)
          );
        }
      }).create({client: this.get('druidClient')});
    }
  }).readOnly(),

  topKData: Ember.computed('model.dimensions', {
    get() {

      return this.get('model.dimensions').map(function(dim) {
        var metric = 'average';
        var params = _.extend(this.baseQueryPayload(), { granularity: 'all', dimension: dim, metric: metric, threshold: 10 } );

        return {
          dimension: dim,
          data: Ember.ArrayProxy.extend({
            init: function () {
              this._super(...arguments);

              var client = this.get('client');

              client.topN(params).then(
                function(data) {
                  this.set(
                    'content', data[0].result.map(function(r) { return {label: r[dim], value: r[metric]};})
                  );
                }.bind(this)
              );
            }
          }).create({client: this.get('druidClient')})
        };
      }.bind(this));
    }
  }).readOnly(),

  allTimeGranularities: [
  	{id: 0, label: 'Minute'},
  	{id: 1, label: 'Hour'},
  	{id: 2, label: 'Day'}
  ],
  timeGranularity: 0,

  allLayoutModes: [
  	{id: 0, label: 'Top/Bottom'},
  	{id: 1, label: 'Left/Right'}
  ],
  layoutMode: 1,

 	startDate: computeEndTime().subtract(1, 'h'),
  endDate: computeEndTime(),
  sd: momentAsMs('startDate'),
  ed: momentAsMs('endDate'),

  startDateStr: momentAsString('startDate', 'll'),
  endDateStr: momentAsString('endDate', 'll'),

  baseQueryPayload: function() {
    return _.extend(
      {
        dataSource: 'metrics_cluster',
        intervals: this.get('startDate').toISOString() + '/' + this.get('endDate').toISOString()
      },
      aggs
    );
  }
});
