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
import Moment from 'moment';

export default Ember.Component.extend({
	startup: function () {
		var m = this.get('content');
		this.$('.form_datetime input').val(m.format('YYYY-MM-DD HH:mm'));

		this.$('.form_datetime input').on('change', function (evt) {
			this.set('content', new Moment(evt.target.value));
		}.bind(this));
		this.$('.form_datetime').datetimepicker({
			autoclose: true,
			todayBtn: true,
			format: 'yyyy-mm-dd hh:ii'
		});
		this.$('.form_datetime').datetimepicker('update');
	}.on('didInsertElement')
});
