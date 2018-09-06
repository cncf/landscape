import { initialState } from '../reducers/mainReducer';
import _ from 'lodash';
import qs from 'query-string';
import fields from '../types/fields';
import { options } from '../components/SortFieldContainer';
const sortOptions = options.map(function(x) {
  return {
    field: JSON.parse(x.id).field,
    direction: JSON.parse(x.id).direction
  }
});

export function filtersToUrl({filters, grouping, sortField, selectedItemId, zoom, mainContentMode = 'card'}) {
  const params = {};
  var fieldNames = _.keys(fields);
  _.each(fieldNames, function(field) {
    addFieldToParams({field: field, filters: filters, params: params});
  });
  addGroupingToParams({grouping: grouping, params: params});
  addSortFieldToParams({sortField: sortField, params: params});
  // addSortDirectionToParams({sortDirection: sortDirection, params: params});
  addSelectedItemIdToParams({selectedItemId: selectedItemId, params: params });
  addMainContentModeToParams({mainContentMode: mainContentMode, params: params});
  addZoomToParams({zoom: zoom, mainContentMode: mainContentMode, params: params});
  if (_.isEmpty(params)) {
    return '/';
  }
  const filtersPart = qs.stringify(params, {encode: false});

  return '/' + filtersPart;
}
export function parseUrl(url) {
  const args = qs.parse(url);
  const newParameters = {
    filters: {

    }
  };
  var fieldNames = _.keys(fields);
  _.each(fieldNames, function(field) {
    setFieldFromParams({
      field: field,
      params: args,
      filters: newParameters.filters
    });
  });
  setGroupingFromParams({newParameters, params: args });
  setSortFieldFromParams({newParameters, params: args });
  // setSortDirectionFromParams({newParameters, params: args });
  if (newParameters.sortField) {
    var sortOption = _.find(sortOptions, {field: newParameters.sortField});
    if (sortOption) {
      newParameters.sortDirection = sortOption.direction;
    }
  }
  setSelectedItemIdFromParams({newParameters, params: args });
  setMainContentModeFromParams({newParameters, params: args });
  setZoomFromParams({newParameters, params: args });
  return newParameters;
}

function addFieldToParams({field, filters, params}) {
  var value = filters[field];
  const fieldInfo = fields[field];
  if (_.isUndefined(value)) {
    return;
  }
  if (JSON.stringify(value) !== JSON.stringify(initialState.filters[field])) {
    if (!_.isArray(value)) {
      value = [value];
    }
    const processedValues = fieldInfo.processValuesBeforeSaving(value);
    const urlValues = processedValues.map(function(v){
      const valueInfo = _.find(fieldInfo.values, {id: v});
      return valueInfo.url
    });
    params[fieldInfo.url] = urlValues.join(',');
  }
}
function addGroupingToParams({grouping, params}) {
  const value = grouping;
  if (_.isUndefined(value)) {
    return;
  }
  if (value !== initialState.grouping) {
    const fieldInfo = fields[value];
    if (grouping === 'no') {
      params['grouping'] = 'no';
    } else {
      params['grouping'] = fieldInfo.url;
    }
  }
}
function addSortFieldToParams({sortField, params}) {
  const value = sortField;
  if (_.isUndefined(value)) {
    return;
  }
  if (value !== initialState.sortField) {
    const fieldInfo = fields[value];
    params['sort'] = fieldInfo.url;
  }
}

function addMainContentModeToParams({mainContentMode, params}) {
  if (mainContentMode !== initialState.mainContentMode) {
    if (mainContentMode === 'landscape') {
      params['format'] = 'landscape';
    }
    if (mainContentMode === 'serverless') {
      params['format'] = 'serverless';
    }
  }
}

function addZoomToParams({zoom, mainContentMode, params}) {
  if (zoom !== initialState.zoom && mainContentMode !== 'card') {
    params['zoom'] = zoom * 100;
  }
}

function addSelectedItemIdToParams({selectedItemId, params}) {
  const value = selectedItemId;
  if (_.isUndefined(value)) {
    return;
  }
  if (value !== initialState.selectedItemId) {
    params['selected'] = value;
  }
}

function setFieldFromParams({field, filters, params}) {
  const fieldInfo = fields[field];
  if (!fieldInfo) {
    return;
  }
  const urlValue = params[fieldInfo.url];
  if (!urlValue) {
    return;
  }
  const parts = urlValue.split(',');
  const values = parts.map(function(part) {
    return _.find(fieldInfo.values, function(x) {
      return x.url.toLowerCase() === part.toLowerCase();
    });
  }).filter(function(x) { return !!x}).map(function(x) {
    return x.id;
  });
  const processedValues = fieldInfo.processValuesBeforeLoading(values);
  const value = fieldInfo.isArray ? processedValues : processedValues[0];
  if (!_.isUndefined(value)) {
    filters[field] = value;
  }
}
function setGroupingFromParams({ newParameters, params}) {
  const urlValue = params.grouping;
  if (!urlValue) {
    return;
  }
  if (urlValue === 'no') {
    newParameters.grouping = 'no'
  } else {
    const fieldInfo =  _.find(_.values(fields), function(x) {
      return x.url.toLowerCase() === urlValue.toLowerCase();
    });
    if (!_.isUndefined(fieldInfo)) {
      newParameters.grouping = fieldInfo.id;
    }
  }
}
function setSortFieldFromParams({ newParameters, params}) {
  const urlValue = params.sort;
  if (!urlValue) {
    return;
  }
    const fieldInfo =  _.find(_.values(fields), function(x) {
      return x.url.toLowerCase() === urlValue.toLowerCase();
    });
  if (!_.isUndefined(fieldInfo)) {
    newParameters.sortField = fieldInfo.id;
  }
}
function setMainContentModeFromParams({ newParameters, params}) {
  const format = params.format;
  if (!format) {
    newParameters.mainContentMode = 'card';
  } else if (format === 'serverless') {
    newParameters.mainContentMode = 'serverless';
  } else if (format === 'landscape') {
    newParameters.mainContentMode = 'landscape';
  }
}

function setZoomFromParams({ newParameters, params}) {
  const zoom = params.zoom;
  if (!zoom) {
    // newParameters.zoom = 1.0;
  } else {
    const zoomAsValue = +params.zoom / 100;
    newParameters.zoom = zoomAsValue;
  }
}

  /*
function setSortDirectionFromParams({ newParameters, params}) {
  const urlValue = params.sortField;
  if (!urlValue) {
    return;
  }
  const options = ['asc', 'desc'];
  const sortDirection =  _.find(options, function(x) {
    return x.toLowerCase() === urlValue.toLowerCase();
  });
  if (!_.isUndefined(sortDirection)) {
    newParameters.sortDirection = sortDirection;
  }
}
*/

function setSelectedItemIdFromParams({ newParameters, params}) {
  const urlValue = params.selected;
  if (!urlValue) {
    return;
  }
  newParameters.selectedItemId = urlValue;
}
