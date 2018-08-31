import React from 'react';
import InternalLink from '../InternalLink';

const ServerlessLink = function({top, left, height, width, color, showPreview, onClick}) {
  return (<div style={{
    position: 'absolute', top: top -5, left: left, height: height, margin: 5, width: width + 2, background: 'white', border: `1px solid ${color}`,
    cursor: 'pointer',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
  }} onClick={onClick} >
  <div style={{ width: width, height: 20, lineHeight: '20px', textAlign: 'center', color: 'white', background: color, fontSize: 12}}> Serverless </div>
  { showPreview &&
      <div style={{ width: width - 10, height: height - 40, margin: 5,
        backgroundImage: 'url("/images/serverless_preview.png")', backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></div>
  }
</div>);
}
export default ServerlessLink;
