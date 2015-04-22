import Ember from 'ember';
import layout from '../templates/components/md-selectize';

export default Ember.Component.extend({
  classNames: ['md-selectize'],
  layout: layout,
  content: null,
  selection: null,
  multiple: false,
  persist: true,
  delimiter: null,
  optionLabelPath: 'content',
  optionValuePath: 'content',
  createItemAction: null,

  _noSelection: Ember.computed.empty('selection')
});
