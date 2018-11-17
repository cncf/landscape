// locate zoom buttons
import IconButton from '@material-ui/core/IconButton';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import FullscreenIcon from '@material-ui/icons/Fullscreen';

import React from 'react';

const FullscreenButton = function({isVisible, isFullscreen, enableFullscreen, disableFullscreen}) {
  if (!isVisible) {
    return null;
  }
  return <div className="fullscreen-button" style={{position:'absolute', zIndex: 7, display: 'inline-block', width: 40}}>
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
