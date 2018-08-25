// locate zoom buttons
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';

import React from 'react';

const ZoomButtons = function({canZoomIn, canZoomOut, onZoomIn, onZoomOut}) {
  return <div style={{position:'absolute', top: -40, right: 0, zIndex: 1}}>
        <IconButton disabled={!canZoomOut} onClick={onZoomOut}>
          <Icon>remove_circle</Icon>
        </IconButton>
        <IconButton disabled={!canZoomIn} onClick={onZoomIn}>
          <Icon>add_circle</Icon>
        </IconButton>
  </div>
}
export default ZoomButtons;
