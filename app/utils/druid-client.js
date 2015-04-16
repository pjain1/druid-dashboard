import ajax from 'ic-ajax';
import Ember from 'ember';

var BASIC_REQUIRED_PARAMS = ['dataSource', 'intervals'];
var TOPN_REQUIRED_PARAMS = ['aggregations', 'postAggregations'];
var TIMESERIES_REQUIRED_PARAMS = ['aggregations', 'postAggregations'];
// var GROUPBY_REQUIRED_PARAMS = ['dimensions'];
// var SEARCH_REQUIRED_PARAMS = ['query'];






function DruidClient() {

}

DruidClient.prototype._createMetricSpec = function (type, field, name) {
  return {type: type, fieldName: field, name: (name || field)};
};

DruidClient.prototype._createFilter = function(dim, vals) {
  function createSelector(val) {
    return { type: 'selector', dimension: dim, value: val };
  }

  if (Array.isArray(vals)) {
    if (vals.length === 1) {
      return createSelector(vals[0]);
    }
    return { type: 'or', fields: vals.map(createSelector) };
  } else {
    createSelector(vals);
  }
};

DruidClient.prototype.query = function(queryType, dataSource, intervals, params) {
  Ember.assert('Missing required parameter: queryType', queryType);
  Ember.assert('Missing required parameter: dataSource', dataSource);
  Ember.assert('Missing required parameter: intervals', intervals);
  this._validateParams(queryType, params);

  var requestPayload = this._generateRequestPayload(queryType, dataSource, intervals, params);
  return ajax(`/druid/v2/?queryType=${queryType}`, {
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(requestPayload),
    dataType: 'json'
  });
};

DruidClient.prototype._requiredParamsForQueryType = function (queryType) {
  Ember.assert('queryType must be provided', queryType);
  switch(queryType) {
    case 'topN':
      return BASIC_REQUIRED_PARAMS.concat(TOPN_REQUIRED_PARAMS);
    case 'timeseries':
      return BASIC_REQUIRED_PARAMS.concat(TIMESERIES_REQUIRED_PARAMS);
    default:
      throw `queryType ${queryType} is not supported`;
  }
};

DruidClient.prototype._validateParams = function(queryType, params) {
  Ember.assert('queryType must be provided', queryType);
  var requiredParams = this._requiredParamsForQueryType(queryType);

  requiredParams.forEach(function (item) {
    Ember.assert(`Missing required parameter: ${item}`, params[item]);
  });
};

DruidClient.prototype._generateRequestPayload = function(queryType, dataSource, intervals, opts) {
  var options = opts || {};
  var payload = {
    queryType,
    dataSource,
    intervals
  };
  if (options.granularity) {payload.granularity = options.granularity;}
  if (options.dimension) {payload.dimension = options.dimension;}
  if (options.metric) {payload.metric = options.metric;}
  if (options.threshold) {payload.threshold = options.threshold;}
  if (options.aggregations) {payload.aggregations = options.aggregations;}
  if (options.postAggregations) {payload.postAggregations = options.postAggregations;}
  payload.filter = options.filter || null;

  return payload;
};

export default DruidClient;
