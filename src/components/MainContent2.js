import React from 'react';
import _ from 'lodash';

const itemWidth = 30;
const itemHeight = 30;

const drawItem = function({item, x, y, isLarge}) {
  const k = isLarge ? 2 : 1;
  return <div style={{ position: 'absolute', left: itemWidth * x, top: itemHeight * y, border: '1px solid green', width: itemWidth  * k, height: itemHeight * k }}>
    <img src={item.href} style={{ maxHeight: itemWidth * k - 5, maxWidth:itemHeight * k - 5}} />
  </div>;
}

const HorizontalSubcategory = function({subcategory, rows}) {
  console.info('sc:', subcategory);
  const categoryHeight = rows;
  const total = _.sumBy(subcategory.items, function(item) {
    return item.cncfProject ? 4 : 1;
  });
  const items = _.orderBy(subcategory.items, (x) => !x.cncfProject);
  const cols = Math.ceil(total / categoryHeight );
  const width = itemWidth * cols;
  const height = itemHeight * categoryHeight;
  let x = 0;
  let y = 0;
  let busy = {};
  return <div style={{ width: width + 20, height: height, position: 'relative' }}>
    { items.map(function(item) {
      const isLarge = !!item.cncfProject;
      const result = {item, y: y, x: x, isLarge: isLarge};
      busy[`${x}:${y}`] = true;
      if (isLarge) {
        busy[`${x + 1}:${y}`] = true;
        busy[`${x}:${y+1}`] = true;
        busy[`${x + 1}:${y+1}`] = true;
      }
      while(busy[`${x}:${y}`]) {
        x += 1;
        if (x >= cols) {
          x = 0;
          y += 1;
        }
      }

      return drawItem(result);
    }) }
  </div>
};

const VerticalSubcategory = function({subcategory, cols}) {
  const categoryWidth = cols;
  const total = _.sumBy(subcategory.items, function(item) {
    return item.cncfProject ? 4 : 1;
  });
  const items = _.orderBy(subcategory.items, (x) => !x.cncfProject);
  const raws = Math.ceil(total / categoryWidth );
  const height = itemHeight * raws;
  const width  = itemWidth * categoryWidth;
  let x = 0;
  let y = 0;
  let busy = {};
  return <div style={{ width: width, height: height + 20, position: 'relative' }}>
    { items.map(function(item) {
      const isLarge = !!item.cncfProject;
      const result = {item, y: y, x: x, isLarge: isLarge};
      busy[`${x}:${y}`] = true;
      if (isLarge) {
        busy[`${x + 1}:${y}`] = true;
        busy[`${x}:${y+1}`] = true;
        busy[`${x + 1}:${y+1}`] = true;
      }
      while(busy[`${x}:${y}`]) {
        x += 1;
        if (x >= categoryWidth) {
          x = 0;
          y += 1;
        }
      }

      return drawItem(result);
    }) }
  </div>
};

const drawSeparator = function() {
  return <div style={{ right: 10, top: 15, bottom: 5, background: 'black', width: 1, position: 'absolute' }}></div>

}

const drawVerticalSeparator = function() {
  return <div style={{ bottom: 10, left: 15, right: 5, background: 'black', height: 1, position: 'absolute' }}></div>

}

const HorizontalCategory = function({header, subcategories, rows, width, height, top, left}) {
  return (
    <div style={{position: 'absolute', height: height, margin: '5px', width: width, top: top - 5, left: left, background: 'lightblue'}} ><div style={{transform: 'rotate(-90deg)', width: height, height: 30, top: height / 2 - 30 / 2, left: -(height / 2 - 30/2), textAlign: 'center', position: 'absolute', background: 'red'}}>{header}</div>
      <div style={{width: 40, display: 'inline-block'}} />
      {subcategories.map(function(subcategory, index, all) {
        return <div style={{position: 'relative', display: 'inline-block', fontSize: '8px'}}><span>{subcategory.name}</span>
          <HorizontalSubcategory subcategory={subcategory} rows={rows} />
          { index !== all.length - 1 && drawSeparator() }
        </div>
      })}

  </div>);
}

const VerticalCategory = function({header, subcategories, cols = 6, top, left, width, height}) {
  return (<div style={{}}>
    <div style={{
      position: 'absolute', top: top -5, left: left, height: height, margin: 5, width: width, background: 'lightblue'
    }} ><div style={{ width: width, height: 30, textAlign: 'center', background: 'red'}}>{header}</div>
      {subcategories.map(function(subcategory, index, all) {
        return <div style={{position: 'relative', fontSize: '8px'}}><span>{subcategory.name}</span>
          <VerticalSubcategory subcategory={subcategory} cols={cols} />
          { index !== all.length - 1 && drawVerticalSeparator() }
        </div>
      })}
    </div>
  </div>);



}


const MainContent2 = ({groupedItems, onSelectItem, onOpenItemInNewTab}) => {
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
    <HorizontalCategory {...cat1} rows={5} width={980} height={200} top={0} left={0} />
    <HorizontalCategory {...cat2} rows={3} width={980} height={120} top={210} left={0} />
    <HorizontalCategory {...cat3} rows={3} width={980} height={120} top={340} left={0} />
    <HorizontalCategory {...cat4} rows={3} width={980} height={120} top={470} left={0} />
    <HorizontalCategory {...cat5} rows={3} width={380} height={120} top={600} left={0} />
    <VerticalCategory {...cat6} cols={6} width={240} height={700} top={0} left={1000} />
    <VerticalCategory {...cat7} cols={5} width={200} height={700} top={0} left={1250} />
    <HorizontalCategory {...cat8} rows={3} width={780} height={120} top={600} left={670} />
  </div>




};

export default MainContent2;
