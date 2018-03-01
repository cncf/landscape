// We will have all our actions in one file

// State Description (TODO: Add FLOW here!)
// data: null | { .. Data ... }
import { loadData } from './api';
import { filtersToUrl } from '../utils/syncToUrl';
import _ from 'lodash';
import { push } from 'react-router-redux';

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
// thunk
export function loadMainData() {
  return async function (dispatch) {
    const result = await loadData();
    dispatch(setData(result));
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


export function changeParameters(value) {
  return function(dispatch) {
    dispatch(setParameters(value));
    dispatch(setReady());
  }
}
export function resetParameters() {
  return function(dispatch) {
    dispatch(setParameters(initialState));
    dispatch(push('/'));
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
function setReady() {
  return {
    type: 'Main/SetReady'
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
function setReadyHandler(state) {
  return { ...state, ready: true };
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
      return setReadyHandler(state);
    case 'Main/ShowFilters':
      return showFiltersHandler(state);
    case 'Main/HideFilters':
      return hideFiltersHandler(state);
    default:
      return state;
  }
}

export default reducer;
