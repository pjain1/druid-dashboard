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

import Ember from 'ember';

export function numberWithSuffix(inputString) {
	var input = parseInt(inputString, 10);
	Ember.assert("Missing required maxValue argument", input === 0 || !Ember.isEmpty(input));
	var result = '';
	if (input > 1000 && input < 1000000) {
		result = '%@<span class="suffix">K</span>'.fmt(Math.round(input/1000));
	}
	else if (input > 1000000 && input < 1000000000) {
		result = '%@<span class="suffix">M</span>'.fmt(Math.round(input/1000000));
	}
	else if (input > 1000000000) {
		result = '%@<span class="suffix">B</span>'.fmt(Math.round(input/1000000000));
	}
	else {
		result = input;
	}

  return new Ember.Handlebars.SafeString(result);
}

export default Ember.Handlebars.makeBoundHelper(numberWithSuffix);
