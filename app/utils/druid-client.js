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

import ajax from 'ic-ajax';
import Ember from 'ember';

var BASIC_REQUIRED_PARAMS = ['dataSource', 'intervals', 'granularity'];
var REQUIRED_PARAMS = {
  topN: BASIC_REQUIRED_PARAMS.concat(['metric', 'dimension', 'threshold', 'aggregations']),
  timeseries: BASIC_REQUIRED_PARAMS.concat(['aggregations'])
};

function DruidClient() {

}

function createMetricSpec(type, field, name) {
  return {
    type: type,
    fieldName: field,
    name: (name || field)
  };
}

DruidClient.aggs = {
  metricSpec: createMetricSpec,
  longSum: createMetricSpec.bind(null, 'longSum'),
  doubleSum: createMetricSpec.bind(null, 'doubleSum')
};

DruidClient.postAggs = {
  div: function(name, fields) {
    var theFields = fields.map(
      function(val) {
        if (typeof val === 'string') {
          return this.field(val);
        }
        return val;
      }.bind(this)
    );
    return {
      type: "arithmetic",
      name: name,
      fn: "/",
      fields: theFields
    };
  },
  field: function(name) {
    return {
      type: "fieldAccess",
      fieldName: name,
      name: name
    };
  }
};

DruidClient.buildFilter = function(dim, vals) {
  function createSelector(val) {
    return {
      type: 'selector',
      dimension: dim,
      value: val
    };
  }

  if (Array.isArray(vals)) {
    if (vals.length === 1) {
      return createSelector(vals[0]);
    }
    return {
      type: 'or',
      fields: vals.map(createSelector)
    };
  } else {
    createSelector(vals);
  }
};

DruidClient.prototype.timeseries = function(params) {
  return this.query('timeseries', params.dataSource, params.intervals, params);
};

DruidClient.prototype.topN = function(params) {
  return this.query('topN', params.dataSource, params.intervals, params);
};

DruidClient.prototype.query = function(queryType, dataSource, intervals, params) {
  Ember.assert(queryType + ': Missing required parameter: queryType', queryType);
  Ember.assert(queryType + ': Missing required parameter: dataSource', dataSource);
  Ember.assert(queryType + ': Missing required parameter: intervals', intervals);

  this._validateParams(queryType, params);

  var requestPayload = this._generateRequestPayload(queryType, dataSource, intervals, params);
  return ajax(`/druid/v2/?queryType=${queryType}`, {
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(requestPayload),
    dataType: 'json'
  });
};

DruidClient.prototype._requiredParamsForQueryType = function(queryType) {
  Ember.assert('queryType must be provided', queryType);
  var requiredParams = REQUIRED_PARAMS[queryType];
  if (requiredParams == null) {
    throw `queryType ${queryType} is not supported`;
  }
  return requiredParams;
};

DruidClient.prototype._validateParams = function(queryType, params) {
  Ember.assert('queryType must be provided', queryType);
  var requiredParams = this._requiredParamsForQueryType(queryType);

  requiredParams.forEach(function(item) {
    Ember.assert(`Missing required parameter: ${item}`, params[item]);
  });
};

DruidClient.prototype._generateRequestPayload = function(queryType, dataSource, intervals, opts) {
    var retVal = Ember.$.extend({}, opts, {
      queryType, dataSource, intervals
    });

    if (retVal.filter != null) {
      var filters = Object.keys(retVal.filter)
        .filter(dim => retVal.filter[dim] != null)
        .map(dim => DruidClient.buildFilter(dim, retVal.filter[dim]));

          switch (filters.length) {
            case 0:
              retVal.filter = null;
              break;
            case 1:
              retVal.filter = filters[0];
              break;
            default:
              retVal.filter = {
                type: 'and',
                fields: filters
              };
          }
        }

      return retVal;
    };

    export default DruidClient;
