import React from 'react';
import InternalLink from '../InternalLink';

const ServerlessLink = function({zoom, top, left, height, width, color, showPreview, onClick}) {
  return (<div style={{
    position: 'absolute', top: (top - 5) * zoom, left: left * zoom, height: height * zoom, margin: 5 * zoom, width: (width + 2) * zoom, background: 'white', border: `${1 * zoom}px solid ${color}`,
    cursor: 'pointer',
    boxShadow: `0 ${4 * zoom}px ${8 * zoom}px 0 rgba(0, 0, 0, 0.2), 0 ${6 * zoom}px ${20 * zoom}px 0 rgba(0, 0, 0, 0.19)`
  }} onClick={onClick} >
  <div style={{ width: width * zoom, height: 20 * zoom, lineHeight: `${20 * zoom}px`, textAlign: 'center', color: 'white', background: color, fontSize: 12 * zoom}}> Serverless </div>
  { showPreview &&
      <div style={{ width: (width - 10) * zoom, height: (height - 40) * zoom, margin: 5 * zoom,
        backgroundImage: 'url("/images/serverless_preview.png")', backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></div>
  }
</div>);
}
export default ServerlessLink;
