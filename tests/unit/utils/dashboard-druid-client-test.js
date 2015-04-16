import DashboardDruidClient from '../../../utils/dashboard-druid-client';
import { module, test } from 'qunit';

import topNRequestPayload from '../../payloads/top-n-request';
import topNResponsePayload from '../../payloads/top-n-response';
import timeSeriesRequestPayload from '../../payloads/timeseries-request';
import timeSeriesResponePayload from '../../payloads/timeseries-response';

module('DashboardDruidClient');

// Replace this with your real tests.
test('it exists', function(assert) {
  assert.ok(DashboardDruidClient);
});

test('it generates the correct payload for topN queries', function (assert) {
  var client = new DashboardDruidClient();

  assert.deepEqual(client._generateTopNQueryPayload(
    'wikipedia',
    '2015-04-15T16:30:00.000Z', '2015-04-16T17:30:00.000Z', 'minute'
    ), topNRequestPayload, 'Correct top-N payload');
});

test('it generates the correct payload for timeseries queries', function (assert) {
  var client = new DashboardDruidClient();

  assert.deepEqual(client._generateTimeSeriesQueryPayload(
    'wikipedia',
    '2015-04-15T16:30:00.000Z', '2015-04-16T17:30:00.000Z', 'minute'
    ), timeSeriesRequestPayload, 'Correct timeseries payload');
});
