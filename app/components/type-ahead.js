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
	searchQuery: null,
	searchResults: [],
	isActive: false,

	fetchSearchResults: function () {
		this.set('isActive', true);
     	var arg = this.get('searchQuery');
		if(arg && arg.length > 2){
			this.sendAction('typeAheadAction', { action: 'typeAheadAction', input: { dimName: this.get('dim'), dimValue: arg } });
		}
    }.observes('searchQuery'),

	actions: {
		rowClicked2: function (arg) {
			this.set('isActive', false);
			this.sendAction('action', arg);
		}
	}
});
