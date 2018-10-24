// locate zoom buttons
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';

import React from 'react';

const FullscreenButton = function({isVisible, isFullscreen, enableFullscreen, disableFullscreen}) {
  if (!isVisible) {
    return null;
  }
  return <div className="fullscreen-button" style={{position:'absolute', top: -40, right: 190, zIndex: 7}}>
        { isFullscreen ?
        <IconButton onClick={disableFullscreen}>
          <Icon>fullscreen_exit</Icon>
        </IconButton>
          :
        <IconButton onClick={enableFullscreen} >
          <Icon>fullscreen</Icon>
        </IconButton>
        }
  </div>
}
export default FullscreenButton;
