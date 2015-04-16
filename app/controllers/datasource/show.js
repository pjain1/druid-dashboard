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
};

export default Ember.Controller.extend({
  druidClient: function () {
    return new DashboardDruidClient();
  }.property(),
  actions: {
    tryQuery: function () {
      this.get('druidClient').timeSeriesQuery('wikipedia',
    '2015-04-15T16:30:00.000Z', '2015-04-16T17:30:00.000Z', 'minute')
    }
  },
	queryParams: ['layoutMode', 'timeGranularity', 'sd', 'ed'],

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
