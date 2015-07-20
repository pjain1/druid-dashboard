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

	//typeAheadResults: function () {
	//	var input = this.get('searchQuery');
	//	console.log('search query is: '+input);
		//Ember.run.debounce(this, this.fetchSearchResults, input, 500/*ms*/);
		//return this.get('searchResults');
	//	return this.fetchSearchResults(input);
	//}.property('searchQuery'),

	fetchSearchResults: function (arg) {
		console.log('Setting is Active for '+this.get('dim')+' to true');
		this.set('isActive', true);
	  	var content = [];
     	arg = this.get('searchQuery');
      	console.log('Search query '+arg);
		if(arg && arg.length > 2){
			console.log('action '+this.get('action'));
			console.log('act '+this.get('act'));
			this.sendAction('act', { action: 'act', input: { dimName: this.get('dim'), dimValue: arg } });
			//this.sendAction('autocomp', {dimension: this.get('dim'), value: arg});
			//console.log('Search results '+content);
			//var regex = new RegExp(arg, 'i');
	  		//content = content.filter(function(name) {
	    	//	return name.match(regex);
	  		//});
		}
		//console.log('Setting search results to '+content);
		//this.get('searchResults', content);
		//return content;
    }.observes('searchQuery'),

    applySelectedFilter: function () {
     	console.log('Selected value is '+this.get('selectedValue'));
		console.log('Action is '+this.get('update'));     	
    	//this.send('rowClicked2', this.get('selectedValue'))
    }.observes('selectedValue'),

	actions: {
		rowClicked2: function (arg) {
			this.set('isActive', false);
			console.log("searching for ......"+arg);
			console.log("dims is "+this.get('dim'));
			console.log('Sending action: '+this.get('action')+' to the controller');
			//typeAheadResults.call(this, arg);
			// this will call rowClicked action on top-k-list component
			// because 'rowClicked' was passed as action value in top-k-list.hbs 
			// while using this template
			this.sendAction('action', arg);
		}
	}
});
