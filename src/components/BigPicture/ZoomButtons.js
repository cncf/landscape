// locate zoom buttons
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import React from 'react';

const ZoomButtons = function({canZoomIn, canZoomOut, zoomText, onZoomIn, onZoomOut, onZoomReset}) {
  return <div className="zoom-buttons" style={{position:'absolute'}}>
        <IconButton disabled={!canZoomOut} onClick={onZoomOut}>
          <RemoveCircleIcon />
        </IconButton>
        <Button onClick={onZoomReset}>{zoomText}</Button>
        <IconButton disabled={!canZoomIn} onClick={onZoomIn}>
          <AddCircleIcon />
        </IconButton>
  </div>
}
export default ZoomButtons;
