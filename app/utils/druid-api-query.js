export default function doQuery() {
  var query = Ember.$.extend.apply(null, [{}].concat(Array.prototype.slice.call(arguments, 0)));

  if (query.filter != null) {
    var filters = Object.keys(query.filter)
      .filter(function(key){ return query.filter[key] != null; })
      .map(function(toFilter) {
                               return buildFilter(toFilter, query.filter[toFilter]);
                             });

    switch (filters.length) {
      case 0:
        query.filter = null;
        break;
      case 1:
        query.filter = filters[0];
        break;
      default:
        query.filter = {type: 'and', fields: filters};
    }
  }

  return ajax(
    '/druid/v2/?queryType=' + query.queryType,
    {
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(query),
      dataType: 'json'
    }
  );
}