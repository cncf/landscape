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
      <img src="/images/qrcode-s.cncf.io.svg" style={{
        position: 'absolute',
        top: 10 * zoom,
        left: 5 * zoom,
        width: 70 * zoom,
        height: 70 * zoom
      }}></img>
      <div style= {{
        position: 'absolute',
        top: 75 * zoom,
        left: 10 * zoom,
        fontSize: 16 * zoom,
        color: '#666'
      }}>s.cncf.io</div>
      <div style={{
        position: 'absolute',
        top: 15 * zoom,
        left: 90 * zoom,
        right: 150 * zoom,
        fontSize: 9 * zoom,
        fontStyle: 'italic'
      }}>
      {children}
      </div>
      <img src="/images/cncf-landscape.svg" style={{
        position: 'absolute',
        width: 110 * zoom,
        right: 15 * zoom,
        top: 10 * zoom
      }}></img>
      <img src="/images/cncf.svg" style={{
        position: 'absolute',
        width: 109 * zoom,
        right: 15 * zoom,
        top: 45 * zoom
      }}></img>
      <img src="/images/redpoint.svg" style={{
        position: 'absolute',
        width: 109 * zoom,
        right: 15 * zoom,
        top: 70 * zoom
      }}></img>
  </div>
)
export default LandscapeInfo;
