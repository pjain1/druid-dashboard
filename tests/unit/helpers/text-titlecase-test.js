import {
  textTitlecase
} from '../../../helpers/text-titlecase';
import { module, test } from 'qunit';

module('TextTitlecaseHelper');

// Replace this with your real tests.
test('it works', function(assert) {
  var result = textTitlecase(['capitalize me']);
  assert.ok(result);
});
