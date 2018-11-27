import React from 'react';

const LandscapeInfo = ({zoom, width, height, top, left, children}) => (
  <div style={{
    position: 'absolute',
    width: width * zoom,
    height: (height - 20) * zoom,
    top: top * zoom,
    left: left * zoom,
    border: `${1 * zoom}px solid black`,
    background: 'white',
    borderRadius: 15 * zoom,
    marginTop: 20 * zoom,
    boxShadow: `0 ${4 * zoom}px ${8 * zoom}px 0 rgba(0, 0, 0, 0.2), 0 ${6 * zoom}px ${20 * zoom}px 0 rgba(0, 0, 0, 0.19)`
  }}>
      <img src="/images/qrcode-l.cncf.io.svg" style={{
        position: 'absolute',
        top: 15 * zoom,
        left: 5 * zoom,
        width: 90 * zoom,
        height: 90 * zoom
      }}></img>
      <div style= {{
        position: 'absolute',
        top: 104 * zoom,
        left: 10 * zoom,
        fontSize: 23 * zoom,
        color: '#666'
      }}>l.cncf.io</div>
      <div style={{
        position: 'absolute',
        top: 20 * zoom,
        left: 100 * zoom,
        right: 120 * zoom,
        fontSize: 10 * zoom,
        fontStyle: 'italic'
      }}>
      {children}
      </div>
      <img src="/images/left-logo.svg" style={{
        position: 'absolute',
        width: 110 * zoom,
        right: 5 * zoom,
        top: 20 * zoom
      }}></img>
      <img src="/images/right-logo.svg" style={{
        position: 'absolute',
        width: 109 * zoom,
        right: 5 * zoom,
        top: 60 * zoom
      }}></img>
  </div>
)
export default LandscapeInfo;
