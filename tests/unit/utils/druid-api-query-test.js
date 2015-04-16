import druidApiQuery from '../../../utils/druid-api-query';
import {
	module, test
}
from 'qunit';

import Pretender from 'pretender';
import json from '../../helpers/json';

module('druidApiQuery');

// Replace this with your real tests.
test('it works', function(assert) {
	var result = druidApiQuery();
	assert.ok(result);
});

test('topN query works', function(assert) {
	var server = new Pretender();

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
	);

	server.shutdown();
});