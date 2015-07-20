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
	tagName: 'table',
	classNames: ['table', 'table-striped', 'top-k-list'],
	//searchQuery: null,

	//typeAhead: function () {
	//	var content = ["test1", "test2", "test3"];
	//	return content;
	//},

	beautifyTooltips: function () {
		// this.$('[data-toggle="tooltip"]').tooltip();
	},
	contentChangedObserver: function () {
		Ember.run.debounce(this, this.beautifyTooltips, 100);
	}.observes('content.[]').on('didInsertElement'),

	actions: {
		rowClicked: function (arg) {
			console.log('Sending action: '+this.get('action')+' to the controller');
			this.sendAction('action', {dimension: this.get('content.query.dimension'), value: arg});
		},

		doSearch: function (arg) {
			console.log('Sending action in topklist: '+arg.action+' to the controller with arg '+arg.input.dimName+' '+arg.input.dimValue);
			this.sendAction(arg.action, arg.input);
		}
	}
});
