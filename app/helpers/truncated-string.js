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

export function truncatedString(input, options) {
	var w = options.hash.width || 20;
	if (input && input.length > w) {
		return new Ember.Handlebars.SafeString(
			input.substring(0, w - 3) + '<span data-toggle="tooltip" data-placement="auto" title="%@">...</span>'.fmt(input)
		);
	} else {
		return input;
	}
}

export default Ember.Handlebars.makeBoundHelper(truncatedString);