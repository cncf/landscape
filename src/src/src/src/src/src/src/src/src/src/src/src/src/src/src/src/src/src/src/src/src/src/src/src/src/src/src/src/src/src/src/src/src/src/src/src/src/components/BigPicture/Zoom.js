// locate zoom buttons

import React from 'react';

const Zoom = function({zoom, children}) {
  return <div style={{position:'relative', zoom: zoom}}>
    {children}
  </div>
}
export default Zoom;
