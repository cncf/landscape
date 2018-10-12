// locate zoom buttons
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';

import React from 'react';

const FullscreenButton = function({isVisible, isFullscreen, enableFullscreen, disableFullscreen}) {
  if (!isVisible) {
    return null;
  }
  return <div className="fullscreen-button" style={{position:'absolute', top: -40, right: 200, zIndex: 7}}>
        { isFullscreen ?
        <IconButton onClick={disableFullscreen} style={{width: 180}}>
          <Icon>remove_circle</Icon>
          <Button>Exit Fullscreen</Button>
        </IconButton>
          :
        <IconButton onClick={enableFullscreen} style={{width: 180}}>
          <Icon>remove_circle</Icon>
          <Button>View Fullscreen</Button>
        </IconButton>
        }
  </div>
}
export default FullscreenButton;
