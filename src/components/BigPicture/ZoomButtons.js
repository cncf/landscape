// locate zoom buttons
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';

import React from 'react';

const ZoomButtons = function({canZoomIn, canZoomOut, zoomText, onZoomIn, onZoomOut, onZoomReset}) {
  return <div className="zoom-buttons" style={{position:'absolute', top: -40, right: 0, zIndex: 2}}>
        <IconButton disabled={!canZoomOut} onClick={onZoomOut}>
          <Icon>remove_circle</Icon>
        </IconButton>
        <Button onClick={onZoomReset}>{zoomText}</Button>
        <IconButton disabled={!canZoomIn} onClick={onZoomIn}>
          <Icon>add_circle</Icon>
        </IconButton>
  </div>
}
export default ZoomButtons;
