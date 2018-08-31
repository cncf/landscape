import React from 'react';
import InternalLink from '../InternalLink';

const LandscapeLink = function({top, left, height, width, showPreview, onClick}) {
  return (<div style={{
    position: 'absolute', top: top -5, left: left, height: height, margin: 5, width: width + 2,
    cursor: 'pointer',
  }} onClick={onClick} >
  <div style={{ width: width, height: 20, lineHeight: '20px', textAlign: 'center', color: 'white', fontSize: 11}}> Cloud Native Landscape </div>
  { showPreview &&
      <div style={{ width: width - 10, height: height - 40, margin: 5,
        backgroundImage: 'url("/images/landscape_preview.png")', backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></div>
  }
</div>);
}
export default LandscapeLink;
