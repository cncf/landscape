import React from 'react';
import _ from 'lodash';
import LandscapeInfo from './LandscapeInfo';

import {HorizontalCategory, VerticalCategory } from './Elements';



const MainContent2 = ({groupedItems, onSelectItem }) => {
  console.info(groupedItems);
  const cat1 = _.find(groupedItems, {key: 'App Definition and Development'});
  const cat2 = _.find(groupedItems, {key: 'Orchestration & Management'});
  const cat3 = _.find(groupedItems, {key: 'Runtime'});
  const cat4 = _.find(groupedItems, {key: 'Provisioning'});
  const cat5 = _.find(groupedItems, {key: 'Cloud'});
  const cat6 = _.find(groupedItems, {key: 'Platform'});
  const cat7 = _.find(groupedItems, {key: 'Observability and Analysis'});
  const cat8 = _.find(groupedItems, {key: 'Special'});
  return <div style={{position: 'relative', width: 1500}}>
    <HorizontalCategory {...cat1} rows={6} width={1010} height={230} top={0} left={0} color="lightgreen" onSelectItem={onSelectItem} />
    <HorizontalCategory {...cat2} rows={3} width={1010} height={140} top={240} left={0} color="lightblue" onSelectItem={onSelectItem} />
    <HorizontalCategory {...cat3} rows={3} width={1010} height={140} top={390} left={0} color="violet" onSelectItem={onSelectItem}/>
    <HorizontalCategory {...cat4} rows={3} width={1010} height={160} top={550} left={0} color="green" onSelectItem={onSelectItem}/>
    <HorizontalCategory {...cat5} rows={4} width={300} height={160} top={720} left={0} color="darkblue" onSelectItem={onSelectItem} />
    <VerticalCategory {...cat6} cols={6} width={240} height={705} top={0} left={1030} color="blue" onSelectItem={onSelectItem} />
    <VerticalCategory {...cat7} cols={5} width={200} height={705} top={0} left={1280} color="lightblue" onSelectItem={onSelectItem} />
    <HorizontalCategory {...cat8} rows={4} width={740} height={160} top={720} left={730} color="darkblue" onSelectItem={onSelectItem} />
    <LandscapeInfo width={390} height={160} top={720} left={320}>
      This landscape is intended as a map through the previously uncharted terrain of cloud native technologies.
      There are many routes to deploying a cloud native application, with CNCF Projects representing a particularly well-traveled path
    </LandscapeInfo>

  </div>
};

export default MainContent2;
