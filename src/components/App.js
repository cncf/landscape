/* eslint-disable import/no-named-as-default */
import React from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Switch, Route } from 'react-router-dom';

import { FullscreenServerlessContainer, FullscreenLandscapeContainer } from "./BigPicture";
import HomePageContainer from './HomePageContainer';
import NotFoundPage from './NotFoundPage';

// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.

class App extends React.Component {
  render() {
    return (
      <div>
        <CssBaseline />
        <Switch>
          <Route exact path="/" component={HomePageContainer} />
          <Route exact path="/serverless" component={FullscreenServerlessContainer}/>
          <Route exact path="/landscape" component={FullscreenLandscapeContainer}/>
          <Route path="/" component={HomePageContainer} />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element
};

export default App;
