// We will have all our actions in one file

// State Description (TODO: Add FLOW here!)
// data: null | { .. Data ... }
import { loadData, loadPreviewData } from './api';
import { filtersToUrl } from '../utils/syncToUrl';
import _ from 'lodash';
import { push } from 'react-router-redux';
import bus from './bus';
import getGroupedItems from '../utils/itemsCalculator';
import exportItems from '../utils/csvExporter';


export const initialState = {
  data: null,
  ready: false,
  filters: {
    cncfRelation: [],
    stars: null,
    license: [],
    marketCap: null,
    organization: [],
    headquarters: [],
    landscape: []
  },
  grouping: 'cncfRelation',
  sortField: 'name',
  sortDirection: 'asc',
  selectedItemId: null,
  filtersVisible: false
};
// we load main data preview only if it is '/'
export function loadMainData() {
  return async function (dispatch) {
    if (location.pathname === '/') {
      const preview = await loadPreviewData();
      dispatch(setData(preview));
      dispatch(setReady('partially'));
      const result = await loadData();
      dispatch(setData(result));
      dispatch(setReady(true));
    } else {
      const result = await loadData();
      dispatch(setData(result));
      dispatch(setReady(true));
    }
  }
}

export function changeFilter(name, value) {
  return function(dispatch, getState) {
    dispatch(setFilter(name, value));

    // effect - set an url
    const state = getState().main;
    const url = filtersToUrl(state);
    dispatch(push(url));
  }
}

export function changeGrouping(value) {
  return function(dispatch, getState) {
    dispatch(setGrouping(value));

    const state = getState().main;
    const url = filtersToUrl(state);
    dispatch(push(url));
  }
}
export function changeSortField(value) {
  return function(dispatch, getState) {
    dispatch(setSortField(value));

    const state = getState().main;
    const url = filtersToUrl(state);
    dispatch(push(url));
  }
}
export function changeSortDirection(value) {
  return function(dispatch, getState) {
    dispatch(setSortDirection(value));

    const state = getState().main;
    const url = filtersToUrl(state);
    dispatch(push(url));
  }
}

export function changeSortFieldAndDirection(value) {
  return function(dispatch, getState) {
    dispatch(setSortField(value.field));
    dispatch(setSortDirection(value.direction));

    const state = getState().main;
    const url = filtersToUrl(state);
    dispatch(push(url));
  }
}

export function changeSelectedItemId(value) {
  return function(dispatch, getState) {
    dispatch(setSelectedItemId(value));

    const state = getState().main;
    const url = filtersToUrl(state);
    dispatch(push(url));

  }
}

export function closeDialog() {
  return function(dispatch, getState) {
    dispatch(setSelectedItemId(null));

    const state = getState().main;
    const url = filtersToUrl(state);
    dispatch(push(url));
  }
}

export function exportCsv() {
  return function(dispatch, getState) {
    // do the actual export here for now
    const state = getState();
    const groupedItems = getGroupedItems(state);
    exportItems(groupedItems);
  }
}


export function changeParameters(value) {
  return function(dispatch) {
    dispatch(setParameters(value));
  }
}
export function resetParameters() {
  return function(dispatch) {
    dispatch(setParameters(initialState));
    dispatch(push('/'));
    setTimeout(() => bus.emit('scrollToTop'), 1);
  }
}

export function showFilters() {
  return {
    type: 'Main/ShowFilters'
  };
}
export function hideFilters() {
  return {
    type: 'Main/HideFilters'
  };
}

function setData(data) {
  return {
    type: 'Main/SetData',
    data: data
  };
}
function setReady(value) {
  return {
    type: 'Main/SetReady',
    value: value
  };
}

function setFilter(name, value) {
  return {
    type: 'Main/SetFilter',
    name: name,
    value: value
  };
}
function setGrouping(value) {
  return {
    type: 'Main/SetGrouping',
    value: value
  };
}
function setSortField(value) {
  return {
    type: 'Main/SetSortField',
    value: value
  };
}
function setSortDirection(value) {
  return {
    type: 'Main/SetSortDirection',
    value: value
  };
}

function setParameters(value) {
  return {
    type: 'Main/SetParameters',
    value: value
  }
}

function setSelectedItemId(value) {
  return {
    type: 'Main/SetSelectedItemId',
    value: value
  }
}

function setDataHandler(state, action) {
  return { ...state, data: action.data };
}
function setFilterHandler(state, action) {
  return { ...state, filters: {...state.filters, [action.name] : action.value } };
}
function setGroupingHandler(state, action) {
  return {...state, grouping: action.value };
}
function setSortFieldHandler(state, action) {
  return {...state, sortField: action.value };
}
function setSortDirectionHandler(state, action) {
  return {...state, sortDirection: action.value };
}
function setSelectedItemIdHandler(state, action) {
  return {...state, selectedItemId: action.value };
}
function setParametersHandler(state, action) {
  return {...state,
    filters: _.assign({}, initialState.filters, action.value.filters),
    grouping: action.value.grouping || initialState.grouping,
    sortField: action.value.sortField || initialState.sortField,
    sortDirection: action.value.sortDirection || initialState.sortDirection,
    selectedItemId: action.value.selectedItemId || initialState.selectedItemId
  };
}
function setReadyHandler(state, action) {
  return { ...state, ready: action.value };
}
function showFiltersHandler(state) {
  return {...state, filtersVisible: true};
}
function hideFiltersHandler(state) {
  return {...state, filtersVisible: false};
}

function reducer(state = initialState, action) {
  switch(action.type) {
    case 'Main/SetData':
      return setDataHandler(state, action);
    case 'Main/SetFilter':
      return setFilterHandler(state, action);
    case 'Main/SetGrouping':
      return setGroupingHandler(state, action);
    case 'Main/SetSortField':
      return setSortFieldHandler(state, action);
    case 'Main/SetSortDirection':
      return setSortDirectionHandler(state, action);
    case 'Main/SetParameters':
      return setParametersHandler(state, action);
    case 'Main/SetSelectedItemId':
      return setSelectedItemIdHandler(state, action);
    case 'Main/SetReady':
      return setReadyHandler(state, action);
    case 'Main/ShowFilters':
      return showFiltersHandler(state, action);
    case 'Main/HideFilters':
      return hideFiltersHandler(state, action);
    default:
      return state;
  }
}

export default reducer;
