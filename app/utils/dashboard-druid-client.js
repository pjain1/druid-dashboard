import ajax from 'ic-ajax';
import Ember from 'ember';

import DruidClient from './druid-client';

function DashboardDruidClient() {

}

DashboardDruidClient.prototype = new DruidClient();

DashboardDruidClient.prototype.topNQueryResult = function(dataSource, startDate, endDate, granularity, dimension, metric) {

  return Ember.ArrayProxy.extend({
    init: function () {
      this._super(...arguments);
      this.get('client').topNQuery(dataSource, startDate, endDate, granularity, dimension).then(
        data => this.set('content', data[0].result.map(function(r) { return {label: r[dimension], value: r[metric]};}
        ))
      );
    }
  }).create({client: this});
};

DashboardDruidClient.prototype.timeSeriesQueryResult = function(dataSource, startDate, endDate, granularity) {

  return Ember.ArrayProxy.extend({
    init: function () {
      this._super(...arguments);
      this.get('client').timeSeriesQuery(dataSource, startDate, endDate, granularity).then(
        data => this.set('content', data)
      );
    }
  }).create({client: this});
};

DashboardDruidClient.prototype.topNQuery = function(dataSource, startDate, endDate, granularity, dimension) {
  Ember.assert('Missing required parameter: dataSource', dataSource);
  Ember.assert('Missing required parameter: startDate', endDate);
  var requestPayload = this._generateTopNQueryPayload(dataSource, startDate, endDate, granularity, dimension);

  this._validateParams('topN', requestPayload);

  return ajax("/druid/v2/?queryType=topN", {
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(requestPayload),
    dataType: 'json'
  });
};

DashboardDruidClient.prototype.timeSeriesQuery = function(dataSource, startDate, endDate, granularity) {
  Ember.assert('Missing required parameter: dataSource', dataSource);
  Ember.assert('Missing required parameter: startDate', endDate);
  var requestPayload = this._generateTimeSeriesQueryPayload(dataSource, startDate, endDate, granularity);

  this._validateParams('timeseries', requestPayload);

  return ajax("/druid/v2/?queryType=timeseries", {
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(requestPayload),
    dataType: 'json'
  });
};



DashboardDruidClient.prototype._generateTopNQueryPayload = function (datasource, startDate, endDate, granularity, dimension) {
  Ember.assert('Must provide a dimension', dimension);
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
    dimension,
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
