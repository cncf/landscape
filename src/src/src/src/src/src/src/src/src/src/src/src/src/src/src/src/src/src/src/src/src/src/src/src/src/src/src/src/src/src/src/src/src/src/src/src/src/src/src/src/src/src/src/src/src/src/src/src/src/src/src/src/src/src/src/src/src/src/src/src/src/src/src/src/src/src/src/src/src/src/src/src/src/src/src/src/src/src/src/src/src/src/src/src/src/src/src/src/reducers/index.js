import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import mainReducer from './mainReducer';

const rootReducer = combineReducers({
  main: mainReducer,
  routing: routerReducer
});

export default rootReducer;
