import DruidClient from '../../../utils/druid-client';
import { module, test } from 'qunit';

module('DruidClient');

// Replace this with your real tests.
test('it exists', function(assert) {
  assert.ok(DruidClient);
});

test('query - throws an error in absence of a queryType', function (assert) {
  var client = new DruidClient();
  assert.throws(function () {
    client.query(null, null, null, {});
  }, /required parameter: queryType/);
});


test('query - throws an error in absence of a intervals', function (assert) {
  var client = new DruidClient();
  assert.throws(function () {
    client.query('topN', 'wikipedia', null, {granularity: 'all', dataSource: 'wikipedia'});
  }, /required parameter: intervals/);
});

test('query - throws an error in absence of a dataSource', function (assert) {
  var client = new DruidClient();
  assert.throws(function () {
    client.query('topN', null, '2015-04-15T16:30:00.000Z/2015-04-15T16:30:00.000Z', {});
  }, /required parameter: dataSource/);
});

test('query - throws an error in absence of a aggregations', function (assert) {
  var client = new DruidClient();
  assert.throws(function () {
    client.query('topN', 'wikipedia', '2015-04-15T16:30:00.000Z/2015-04-15T16:30:00.000Z', {
      granularity: 'all', dataSource: 'wikipedia', intervals: 'abc', postAggregations: []});
  }, /required parameter: aggregations/);
});

test('query - throws an error in absence of postAggregations', function (assert) {
  var client = new DruidClient();
  assert.throws(function () {
    client.query('topN', 'wikipedia', '2015-04-15T16:30:00.000Z/2015-04-15T16:30:00.000Z', {granularity: 'all', dataSource: 'wikipedia', intervals: 'abc', aggregations: []});
  }, /required parameter: postAggregations/);
});
