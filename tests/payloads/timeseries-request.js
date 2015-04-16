export default {
	"queryType": "timeseries",
	"dataSource": "wikipedia",
	"aggregations": [{
		"type": "longSum",
		"fieldName": "events",
		"name": "events"
	}, {
		"type": "doubleSum",
		"fieldName": "total_value",
		"name": "total_value"
	}],
	"postAggregations": [{
		"type": "arithmetic",
		"name": "average",
		"fn": "/",
		"fields": [{
			"type": "fieldAccess",
			"fieldName": "total_value",
			"name": "total_value"
		}, {
			"type": "fieldAccess",
			"fieldName": "events",
			"name": "events"
		}]
	}],
	"granularity": "minute",
	"intervals": "2015-04-15T16:30:00.000Z/2015-04-16T17:30:00.000Z",
	"filter": null
};
