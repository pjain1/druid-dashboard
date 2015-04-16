import {doQuery, aggs} from '../../../utils/druid-api-query';
import {
	module, test
}
from 'qunit';

import Pretender from 'pretender';
import json from '../../helpers/json';

module('druidApiQuery');

// Replace this with your real tests.
test('it exists', function(assert) {
	assert.ok(doQuery);
});

test('topN query works', function(assert) {
  assert.expect(1);
	var server = new Pretender();

  server.post('/druid/v2', function () {
    return [200, {}, "{}"];
  });

	doQuery({
			queryType: 'topN',
			granularity: 'all',
			dataSource: 'wikipedia',
			threshold: 10
		},
		aggs, {
			granularity: 'minute',
			intervals: "2015-04-10T23:24:43.046Z/2015-04-15T23:24:43.046Z",
			filter: {}
		}
	).then(function() {
    debugger;

  }, function (err) {
    throw err;
  });

	server.shutdown();
});
