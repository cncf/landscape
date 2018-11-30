import React from 'react';
import _ from 'lodash';
import LandscapeInfo from './LandscapeInfo';

import {HorizontalCategory } from './Elements';



const MainContent2 = ({groupedItems, onSelectItem, style, zoom }) => {
  console.info(groupedItems);
  const cat1 = _.find(groupedItems, {key: 'Machine Learning'});
  const cat2 = _.find(groupedItems, {key: 'Deep Learning'});
  const cat3 = _.find(groupedItems, {key: 'Data'});
  const cat4 = _.find(groupedItems, {key: 'Models'});
  const cat5 = _.find(groupedItems, {key: 'Distributed Computing'});
  const cat6 = _.find(groupedItems, {key: 'AI Fairness and Human Rights'});
  const cat7 = _.find(groupedItems, {key: 'Notebook Environments'});
  const cat8 = _.find(groupedItems, {key: 'LF DL Member Companies'});
  return <div style={{...style, position: 'relative', width: 920, height: 640 }}>
    <HorizontalCategory {...cat1} rows={3} width={550} height={130} top={0} left={0} zoom={zoom} color="rgb(78, 171, 207)" onSelectItem={onSelectItem} />
    <HorizontalCategory {...cat2} rows={3} width={350} height={130} top={0} left={585} zoom={zoom} color="rgb(104, 145, 145)" onSelectItem={onSelectItem} />
    <HorizontalCategory {...cat3} rows={2} width={500} height={130} top={160} left={0} zoom={zoom} color="rgb(74, 131, 104)" onSelectItem={onSelectItem}/>
    <HorizontalCategory {...cat4} rows={3} width={650} height={130} top={160} left={520} zoom={zoom} color="rgb(108, 135, 75)" onSelectItem={onSelectItem}/>
    <HorizontalCategory {...cat5} rows={2} width={420} height={130} top={320} left={0} zoom={zoom} color="rgb(64, 89, 163)" onSelectItem={onSelectItem} />
    <HorizontalCategory {...cat6} rows={1} fitWidth width={200} height={130} top={0} left={970} zoom={zoom} color="rgb(124, 200, 182)" onSelectItem={onSelectItem} />
    <HorizontalCategory {...cat7} rows={1} fitWidth width={310} height={130} top={320} left={860} zoom={zoom} color="rgb(124, 200, 182)" onSelectItem={onSelectItem} />
    <LandscapeInfo width={360} height={160} top={300} left={465} zoom={zoom}>
      This landscape is intended as a map to explore open source AI, ML, and DL projects . It includes projects hosted under the LF Deep Learning Foundation and a list of its member companies.
    </LandscapeInfo>
    <HorizontalCategory {...cat8} fitWidth rows={4} width={1170} height={160} top={480} left={0} zoom={zoom} color="rgb(124, 200, 182)" onSelectItem={onSelectItem} />
  </div>
};

export default MainContent2;
