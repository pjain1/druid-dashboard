import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'nav',
	classNames: ['navbar', 'druid-navbar', 'navbar-inverse', 'navbar-static-top'],
	role: 'navigation',
	attributeBindings: ['role']
});
