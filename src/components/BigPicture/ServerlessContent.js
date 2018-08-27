import React from 'react';
import _ from 'lodash';
import LandscapeInfo from './LandscapeInfo';

import {HorizontalCategory } from './Elements';



const ServerlessContent = ({groupedItems, onSelectItem, style }) => {
  console.info(groupedItems);
  const cat1 = _.find(groupedItems, {key: 'Tools'});
  const cat2 = _.find(groupedItems, {key: 'Framework'});
  const cat3 = _.find(groupedItems, {key: 'Security'});
  const cat4 = _.find(groupedItems, {key: 'Platform'});
  return <div style={{...style, position: 'relative', width: 840, height: 500}}>
    <HorizontalCategory {...cat1} rows={1} width={570} height={90} top={0} left={0} color="lightgreen" onSelectItem={onSelectItem} />
    <HorizontalCategory {...cat2} rows={1} width={820} height={90} top={100} left={0} color="lightblue" onSelectItem={onSelectItem} />
    <HorizontalCategory {...cat3} rows={1} width={240} height={90} top={0} left={580} color="violet" onSelectItem={onSelectItem}/>
    <HorizontalCategory {...cat4} rows={2} width={820} height={120} top={200} left={0} color="green" onSelectItem={onSelectItem}/>
    <LandscapeInfo width={500} height={160} top={330} left={0} >
      Serverless computing refers to a new model of cloud native computing,
      enabled by architectures that do not require server management to build and run applications.
      This landscape illustrates a finer-grained deployment model where applications, bundled as one or more functions, are uploaded to a platform and then executed, scaled, and billed in response to the exact demand needed at the moment
    </LandscapeInfo>
  </div>
};

export default ServerlessContent;
