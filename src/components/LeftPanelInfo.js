import React from 'react';

const LeftPanelInfo = ({values}) => {
  return <div style={{ marginTop:'50px', fontSize:'0.7em' }}>
    { JSON.stringify(values, null, 2) }
  </div>
}
export default LeftPanelInfo;
