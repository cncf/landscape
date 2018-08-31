import React from 'react';
import {
  MainContentContainer2,
} from '.';
import HomePageUrlContainer from '../HomePageUrlContainer';

const FullscreenServerless = ({ready}) => {
  if (!ready) {
    return (
      <div>
        <HomePageUrlContainer />
      </div>
    )
  }
  const showPreview = location.search.indexOf('preview') === -1;

  return (
    <div style={{zoom: 4, fontFamily: 'roboto'}}>
        <HomePageUrlContainer />
        <div className="gradient-bg" style={{width: 1600, height: 990, position: 'relative'}}>
          <MainContentContainer2 style={{top: 50, left: 20}} showPreview={showPreview}/>
          <div style={{
            position: 'absolute',
            top: 15,
            left: 600,
            fontSize: 18,
            background: 'rgb(64,89,163)',
            color: 'white',
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 3,
            paddingBottom: 3,
            borderRadius: 5
          }}>See the interactive landscape at l.cncf.io</div>
          <div style={{
            position: 'absolute',
            top: 15,
            right: 12,
            fontSize: 6,
            background: '#eee',
            color: 'rgb(100,100,100)',
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 3,
            paddingBottom: 3,
            borderRadius: 5
          }}>Greyed logos are not open source</div>
          <div style={{
            position: 'absolute',
            top: 10,
            left: 15,
            fontSize: 14,
            color: 'white',
          }}>Cloud Native Landscape </div>
          <div style={{
            position: 'absolute',
            top: 30,
            left: 15,
            fontSize: 12,
            color: '#eee',
          }}>v20180505</div>
        </div>
    </div>
  );
};

export default FullscreenServerless;
