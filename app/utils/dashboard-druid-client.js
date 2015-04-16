import DruidClient from './druid-client';

function DashboardDruidClient() {

}
DashboardDruidClient.prototype = new DruidClient();

DashboardDruidClient.prototype._generateTopNQueryPayload = function (datasource, startDate, endDate, granularity) {
  var aggregations = [
    this._createMetricSpec('longSum', 'events'),
    this._createMetricSpec('doubleSum', 'total_value')
  ];
  var postAggregations = [{
    fields: [
      this._createMetricSpec('fieldAccess', 'total_value'),
      this._createMetricSpec('fieldAccess', 'events')
    ],
    fn: '/',
    name: 'average',
    type: 'arithmetic'
  }];

  var opts = {
    granularity,
    dimension: 'continent',
    metric: 'average',
    threshold: 10,
    aggregations,
    postAggregations
  };
  return this._generateRequestPayload('topN', datasource, `${startDate}/${endDate}`, opts);
};

DashboardDruidClient.prototype._generateTimeSeriesQueryPayload = function (datasource, startDate, endDate, granularity) {
  var aggregations = [
    this._createMetricSpec('longSum', 'events'),
    this._createMetricSpec('doubleSum', 'total_value')
  ];
  var postAggregations = [{
    fields: [
      this._createMetricSpec('fieldAccess', 'total_value'),
      this._createMetricSpec('fieldAccess', 'events')
    ],
    fn: '/',
    name: 'average',
    type: 'arithmetic'
  }];

  var opts = {
    granularity,
    filter: null,
    aggregations,
    postAggregations
  };
  return this._generateRequestPayload('timeseries', datasource, `${startDate}/${endDate}`, opts);
};



export default DashboardDruidClient;
