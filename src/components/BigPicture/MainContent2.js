import React from 'react';
import _ from 'lodash';
import LandscapeInfo from './LandscapeInfo';
import ServerlessLink from './ServerlessLink';

import {HorizontalCategory, VerticalCategory } from './Elements';



const MainContent2 = ({groupedItems, onSelectItem, style, showPreview, switchToServerless, zoom }) => {
  console.info(groupedItems);
  const cat1 = _.find(groupedItems, {key: 'App Definition and Development'});
  const cat2 = _.find(groupedItems, {key: 'Orchestration & Management'});
  const cat3 = _.find(groupedItems, {key: 'Runtime'});
  const cat4 = _.find(groupedItems, {key: 'Provisioning'});
  const cat5 = _.find(groupedItems, {key: 'Cloud'});
  const cat6 = _.find(groupedItems, {key: 'Platform'});
  const cat7 = _.find(groupedItems, {key: 'Observability and Analysis'});
  const cat8 = _.find(groupedItems, {key: 'Special'});
  return <div style={{...style, position: 'relative', width: 1620, height: 900 }}>
    <HorizontalCategory {...cat1} rows={6} width={1000} height={230} top={0} left={0} zoom={zoom} color="rgb(78, 171, 207)" onSelectItem={onSelectItem} />
    <HorizontalCategory {...cat2} rows={3} width={1000} height={140} top={240} left={0} zoom={zoom} color="rgb(104, 145, 145)" onSelectItem={onSelectItem} />
    <HorizontalCategory {...cat3} rows={3} width={1000} height={140} top={390} left={0} zoom={zoom} color="rgb(74, 131, 104)" onSelectItem={onSelectItem}/>
    <HorizontalCategory {...cat4} rows={4} width={1000} height={160} top={550} left={0} zoom={zoom} color="rgb(108, 135, 75)" onSelectItem={onSelectItem}/>
    <HorizontalCategory {...cat5} rows={4} width={220} height={160} top={720} left={0} zoom={zoom} color="rgb(64, 89, 163)" onSelectItem={onSelectItem} />
    <VerticalCategory {...cat6} cols={7} width={280} height={710} top={0} left={1020} zoom={zoom} color="rgb(130, 207, 231)" onSelectItem={onSelectItem} />
    <VerticalCategory {...cat7} cols={7} width={280} height={525} top={0} left={1320} zoom={zoom} color="rgb(142, 209, 216)" onSelectItem={onSelectItem} />
    <HorizontalCategory {...cat8} rows={4} width={940} height={160} top={720} left={660} zoom={zoom} color="rgb(124, 200, 182)" onSelectItem={onSelectItem} />
    <LandscapeInfo width={390} height={160} top={720} left={250} zoom={zoom}>
      This landscape is intended as a map through the previously uncharted terrain of cloud native technologies.
      There are many routes to deploying a cloud native application, with CNCF Projects representing a particularly well-traveled path
    </LandscapeInfo>
    <ServerlessLink left={1320} top={535} width={280} height={175} color="rgb(118, 181, 237)" zoom={zoom} showPreview={showPreview} onClick={switchToServerless} />
  </div>
};

export default MainContent2;
