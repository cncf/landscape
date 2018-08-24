// locate zoom buttons

import React from 'react';

const BigPictureZoom = function({zoom, children}) {
  return <div style={{position:'relative', zoom: zoom}}>
    {children}
  </div>
}
export default BigPictureZoom;
