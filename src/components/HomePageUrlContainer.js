import React from 'react';
import { connect } from 'react-redux';

import createSelector from '../utils/createSelector';
import { parseUrl } from '../utils/syncToUrl';
import { changeParameters} from '../reducers/mainReducer';

// var bouncedFn = _.debounce((fn, args) => {console.info('Real Change!', args);fn(args)}, 10000);
import { history} from '../store/configureStore';

history.listen(function(x) {
  console.info('Url changed: ', x);
});



const getParameters = createSelector(
  (state) => state.routing.location.pathname.split('/').slice(-1)[0],
  function(part) {
    return parseUrl(part);
  }
);

const mapStateToProps = (state) => ({
  info: getParameters(state),
});
const mapDispatchToProps = {
  changeParameters: changeParameters
};


const render = ({info, changeParameters}) => {
  console.info('Want to change : ', JSON.stringify(info));
  window.setTimeout(() => changeParameters(info), 1);
  return <div/>;
  // if we are here - url has changed
  // otherwise everything is cached
  // console.info('Schedule change!', info);
  // bouncedFn(changeParameters, info);
  // return <div/>;
}


export default connect(mapStateToProps, mapDispatchToProps)(render);
