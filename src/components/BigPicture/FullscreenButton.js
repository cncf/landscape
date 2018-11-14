// locate zoom buttons
import IconButton from '@material-ui/core/IconButton';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import FullscreenIcon from '@material-ui/icons/Fullscreen';

import React from 'react';

const FullscreenButton = function({isVisible, isFullscreen, enableFullscreen, disableFullscreen}) {
  if (!isVisible) {
    return null;
  }
  return <div className="fullscreen-button" style={{position:'absolute', top: -40, right: 190, zIndex: 7}}>
        { isFullscreen ?
        <IconButton onClick={disableFullscreen}>
          <FullscreenExitIcon />
        </IconButton>
          :
        <IconButton onClick={enableFullscreen} >
          <FullscreenIcon />
        </IconButton>
        }
  </div>
}
export default FullscreenButton;
