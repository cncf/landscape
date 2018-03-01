// Set up your application entry point here...
/* eslint-disable import/default */

import 'current-device';
import 'babel-polyfill';
import process from 'process';
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import configureStore, { history } from './store/configureStore';
import Root from './components/Root';
import {loadMainData} from './reducers/mainReducer.js';
import './styles/theme.scss';
import ReactGA from 'react-ga';
import isIphone from './utils/isIphone';
require('./favicon.png'); // Tell webpack to load favicon.png
const store = configureStore();

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('app')
);
//Todo: move this to a better place
store.dispatch(loadMainData());

if (process.env.GA) {
  ReactGA.initialize(process.env.GA);
  ReactGA.pageview(window.location.pathname + window.location.search);
  history.listen(function(location) {
    ReactGA.pageview(location.pathname + window.location.search);
  });
}


if (module.hot) {
  module.hot.accept('./components/Root', () => {
    const NewRoot = require('./components/Root').default;
    render(
      <AppContainer>
        <NewRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('app')
    );
  });
}

// Event listener to determine change (horizontal/portrait)
window.addEventListener("orientationchange", updateOrientation);
if (isIphone) {
  setInterval(updateOrientation, 1000);
}
function updateOrientation() {
  if (window.matchMedia("(orientation: portrait)").matches) {
    document.querySelector('html').classList.remove('landscape');
    document.querySelector('html').classList.add('portrait');
  } else {
    document.querySelector('html').classList.remove('portrait');
    document.querySelector('html').classList.add('landscape');
  }
}

