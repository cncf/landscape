import React from 'react';

const LandscapeLink = function({zoom, top, left, height, width, showPreview, onClick}) {
  return (<div style={{
    position: 'absolute', top: (top -5) * zoom, left: left * zoom, height: height * zoom, margin: 5 * zoom, width: (width + 2) * zoom,
    cursor: 'pointer',
  }} onClick={onClick} >
  <div style={{ width: width * zoom, height: 20 * zoom, lineHeight: `${20 * zoom}px`, textAlign: 'center', color: 'white', fontSize: 11 * zoom}}> Cloud Native Landscape </div>
  { showPreview &&
      <div style={{ width: (width - 10) * zoom, height: (height - 40) * zoom, margin: 5 * zoom,
        backgroundImage: 'url("/images/landscape_preview.png")', backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></div>
  }
</div>);
}
export default LandscapeLink;
