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
import DashboardDruidClient from 'druid-ui/utils/dashboard-druid-client';

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

export default Ember.Controller.extend({

  actions: {
    tryQuery: function () {
      this.get('druidClient').timeSeriesQuery('wikipedia',
    '2015-04-15T16:30:00.000Z', '2015-04-16T17:30:00.000Z', 'minute');
    }
  },
	queryParams: ['layoutMode', 'timeGranularity', 'sd', 'ed'],

  druidClient: new DashboardDruidClient(),

  timeSeriesData: Ember.computed({
    get() {
      return this.druidClient.timeSeriesQueryResult('wikipedia', '2015-04-15T16:30:00.000Z', '2015-04-16T17:30:00.000Z', 'minute');
    }
  }).readOnly(),

  topKData: Ember.computed('model.dimensions', {
    get() {
      return this.get('model.dimensions').map(dim => {
        return {
          dimension: dim,
          data: this.druidClient.topNQueryResult('wikipedia', '2015-04-15T16:30:00.000Z', '2015-04-16T17:30:00.000Z', 'all', dim, 'average')
        };
      });
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
  endDateStr: momentAsString('endDate', 'll')
});
