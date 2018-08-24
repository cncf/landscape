import React from 'react';

const LandscapeInfo = ({width, height, top, left}) => (
  <div style={{
    position: 'absolute',
    width: width,
    height: height - 20,
    top: top,
    left: left,
    border: '1px solid black',
    background: 'white',
    borderRadius: 15,
    marginTop: 20
  }}>
      <img src="/images/qr.svg" style={{
        position: 'absolute',
        top: 10,
        left: 0,
        width: 100,
        height: 100
      }}></img>
      <div style= {{
        position: 'absolute',
        top: 110,
        left: 10,
        fontSize: 20,
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
      This landscape is intended as a map through the previously uncharted terrain of cloud native technologies.
      There are many routes to deploying a cloud native application, with CNCF Projects representing a particularly well-traveled path
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
