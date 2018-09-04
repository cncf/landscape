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
      <img src="/images/qrcode-l.cncf.io.svg" style={{
        position: 'absolute',
        top: 15,
        left: 5,
        width: 90,
        height: 90
      }}></img>
      <div style= {{
        position: 'absolute',
        top: 104,
        left: 10,
        fontSize: 23,
        color: '#666'
      }}>l.cncf.io</div>
      <div style={{
        position: 'absolute',
        top: 20,
        left: 100,
        right: 120,
        fontSize: 10,
        fontStyle: 'italic'
      }}>
      {children}
      </div>
      <img src="/images/cncf-landscape.svg" style={{
        position: 'absolute',
        width: 110,
        right: 5,
        top: 20
      }}></img>
      <img src="/images/cncf.svg" style={{
        position: 'absolute',
        width: 109,
        right: 5,
        top: 60
      }}></img>
      <img src="/images/amplify.svg" style={{
        position: 'absolute',
        width: 55,
        right: 5,
        top: 95
      }}></img>
      <img src="/images/redpoint.svg" style={{
        position: 'absolute',
        width: 45,
        right: 65,
        top: 100
      }}></img>
  </div>
)
export default LandscapeInfo;
