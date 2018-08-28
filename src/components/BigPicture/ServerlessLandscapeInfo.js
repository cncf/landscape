import React from 'react';

const LandscapeInfo = ({width, height, top, left, children}) => (
  <div style={{
    position: 'absolute',
    width: width,
    height: height - 20,
    top: top,
    left: left,
    border: '1px solid black',
    background: 'white',
    borderRadius: 15,
    marginTop: 20,
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
  }}>
      <img src="/images/qr.svg" style={{
        position: 'absolute',
        top: 10,
        left: 5,
        width: 70,
        height: 70
      }}></img>
      <div style= {{
        position: 'absolute',
        top: 75,
        left: 10,
        fontSize: 16,
        color: '#666'
      }}>s.cncf.io</div>
      <div style={{
        position: 'absolute',
        top: 15,
        left: 90,
        right: 150,
        fontSize: 9,
        fontStyle: 'italic'
      }}>
      {children}
      </div>
      <img src="/images/cncf-landscape.svg" style={{
        position: 'absolute',
        width: 110,
        right: 15,
        top: 10
      }}></img>
      <img src="/images/cncf.svg" style={{
        position: 'absolute',
        width: 109,
        right: 15,
        top: 45
      }}></img>
      <img src="/images/redpoint.svg" style={{
        position: 'absolute',
        width: 109,
        right: 15,
        top: 70
      }}></img>
  </div>
)
export default LandscapeInfo;
