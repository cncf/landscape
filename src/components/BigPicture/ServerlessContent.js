import React from 'react';
import _ from 'lodash';
import ServerlessLandscapeInfo from './ServerlessLandscapeInfo';

import {HorizontalCategory } from './Elements';
import LandscapeLink from './LandscapeLink';



const ServerlessContent = ({zoom, groupedItems, onSelectItem, style, showPreview = 1, switchToLandscape }) => {
  console.info(groupedItems);
  const cat1 = _.find(groupedItems, {key: 'Tools'});
  const cat2 = _.find(groupedItems, {key: 'Framework'});
  const cat3 = _.find(groupedItems, {key: 'Security'});
  const cat4 = _.find(groupedItems, {key: 'Platform'});
  return <div style={{...style, position: 'relative', width: 840, height: 500}}>
    <HorizontalCategory {...cat1} rows={1} width={570} height={90} top={0} left={0} zoom={zoom} color="rgb(98, 206, 230) " onSelectItem={onSelectItem} />
    <HorizontalCategory {...cat2} rows={1} width={820} height={90} top={100} left={0} zoom={zoom} color="rgb(57, 154, 202)" onSelectItem={onSelectItem} />
    <HorizontalCategory {...cat3} rows={1} width={240} height={90} top={0} left={580} zoom={zoom} color="rgb(57, 152, 74)" onSelectItem={onSelectItem}/>
    <HorizontalCategory {...cat4} rows={2} width={820} height={120} top={200} left={0} zoom={zoom} color="rgb(43, 142, 136)" onSelectItem={onSelectItem}/>
    <ServerlessLandscapeInfo width={520} height={120} top={330} left={5} zoom={zoom} >
      Serverless computing refers to a new model of cloud native computing,
      enabled by architectures that do not require server management to build and run applications.
      This landscape illustrates a finer-grained deployment model where applications, bundled as one or more functions, are uploaded to a platform and then executed, scaled, and billed in response to the exact demand needed at the moment
    </ServerlessLandscapeInfo>
    <LandscapeLink left={595} top={325} width={280} height={145} zoom={zoom} showPreview={showPreview} onClick={switchToLandscape} />
  </div>
};

export default ServerlessContent;
