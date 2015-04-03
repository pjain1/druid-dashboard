import Ember from 'ember';
import Moment from 'moment';

export default Ember.Component.extend({
	tagName: 'svg',
	nvd3Data: function () {
		var xProp = this.get('series.dimensions')[0];
		var yProp = this.get('series.dimensions')[1];

		var dat = {
			values: this.get('series.data').map(
				function (d) {
					return {
            x: new Moment(d[xProp]),
            y: d[yProp]
          };
				}),
			area: true,
			key: this.get('series.label'),
			color: this.get('series.color') || '#2ca02c'
		};
		return dat;
	}.property('series.data', 'series.label'),

	setupGraph: function() {
		nv.addGraph(function() {
			var chart = nv.models.lineChart()
				.margin({
					left: 100
				}) //Adjust chart margins to give the x-axis some breathing room.
				.useInteractiveGuideline(true) //We want nice looking tooltips and a guideline!
				//.transition().duration(350) //how fast do you want the lines to transition?
				.showLegend(true) //Show the legend, allowing users to turn on/off line series.
				.showYAxis(true) //Show the y-axis
				.showXAxis(true) //Show the x-axis
				// .interpolate('bundle')
			;

      var scale = d3.time.scale();
      var tickFormat = scale.tickFormat();
			chart.xAxis //Chart x-axis settings
				.scale(scale)
				.axisLabel('Time')
				.tickFormat(function(d) {
					return tickFormat(new Date(d));
				});

			chart.yAxis //Chart y-axis settings
				.axisLabel(this.get('series.label'));
			this.set('chart', chart);
			/* Done setting the chart up? Time to render it!*/
			// var myData = sinAndCos(); //You need data...

			d3.select(this.$()[0]) //Select the <svg> element you want to render the chart in.
				.datum([
					this.get('nvd3Data')
				]) //Populate the <svg> element with chart data...
				.transition().duration(5000).delay(0)
				.call(chart); //Finally, render the chart!
			//Update the chart when window resizes.
			nv.utils.windowResize(function() {
				chart.update();
			});
			return chart;
		}.bind(this));
	}.on('didInsertElement'),

	updateGraph: function () {
		d3.select(this.$()[0]) //Select the <svg> element you want to render the chart in.
			.datum([
				this.get('nvd3Data')
			]) //Populate the <svg> element with chart data...
			.transition().duration(5000).delay(0)
			.call(this.get('chart')); //Finally, render the chart!
	}.observes('nvd3Data'),

	updateChart: function () {
		this.get('chart').update();
	},

	redrawChartOnLayoutChange: function () {
		Ember.run.debounce(this, this.updateChart, 200);

	}.observes('dashLayout')
});
