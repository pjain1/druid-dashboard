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

export default Ember.Component.extend({
	allColors: ['#4CAF50', '#9C27B0', '#3F51B5',
		'#00BCD4','#F44336', '#E91E63', '#FF5722'],

	seriesData: function () {
		var i = -1;
		return (this.get('series') || []).map(
			function (x) {
				i++;
				return Ember.$.extend({color: this.get('allColors')[i]}, x);
			}.bind(this)
		);
	}.property('series')
});
