import React from 'react';
import _ from 'lodash';

const itemWidth = 36;
const itemHeight = 32;

const drawItem = function({item, x, y, isLarge}) {
  if (isLarge) {
    return drawLargeItem({item, x, y});
  }
  const k = 1;
  return <div style={{
    position: 'absolute',
    left: itemWidth * x + 5,
    top: itemHeight * y,
    width: itemWidth  * k,
    height: itemHeight * k }}>
    <img src={item.href} style={{
      width: itemWidth * k - 2,
      height: itemHeight * k - 2,
      margin: 2,
      padding: 2,
      border: '1px solid grey',
      borderRadius: 3,
    }} />
  </div>;
}

const drawLargeItem = function({item, x, y}) {
  const k = 2;
  const color = {
    'sandbox': 'blue',
    'incubating': 'green',
    'graduated': 'red'
  }[item.cncfRelation];
  const label = {
    'sandbox': 'CNCF Sandbox',
    'incubating': 'CNCF Incubating',
    'graduated': 'CNCF Graduated'
  }[item.cncfRelation];
  return <div style={{
    position: 'absolute',
    border: `2px solid ${color}`,
    left: itemWidth * x + 5 + 3,
    top: itemHeight * y + 3,
    width: itemWidth  * k - 6,
    height: itemHeight * k - 6 }}>
    <img src={item.href} style={{
      width: itemWidth * k - 9 - 2,
      height: itemHeight * k - 9 - 2 - 10,
      margin: 2,
      padding: 2
    }} />
  <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 10, textAlign: 'center', background: color, color: 'white', fontSize: 7.8, lineHeight: '13px'}}>
    {label}
  </div>
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
  return <div style={{ width: width, height: height, position: 'relative' }}>
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

const VerticalCategory = function({header, subcategories, cols = 6, top, left, width, height, color}) {
  return (<div style={{}}>
    <div style={{
      position: 'absolute', top: top -5, left: left, height: height, margin: 5, width: width, background: 'white', border: `1px solid ${color}`
    }} ><div style={{ width: width, height: 20, lineHeight: '20px', textAlign: 'center', color: 'white', background: color, fontSize: 12}}>{header}</div>
      {subcategories.map(function(subcategory) {
        return <div style={{position: 'relative'}}>
          <div style={{ fontSize: '10px', lineHeight: '15px', textAlign: 'center', color: color}}>{subcategory.name}</div>
          <VerticalSubcategory subcategory={subcategory} cols={cols} />
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
    <HorizontalCategory {...cat1} rows={6} width={980} height={230} top={0} left={0} />
    <HorizontalCategory {...cat2} rows={4} width={980} height={160} top={240} left={0} />
    <HorizontalCategory {...cat3} rows={4} width={980} height={160} top={410} left={0} />
    <HorizontalCategory {...cat4} rows={4} width={980} height={160} top={580} left={0} />
    <HorizontalCategory {...cat5} rows={4} width={380} height={160} top={750} left={0} />
    <VerticalCategory {...cat6} cols={6} width={240} height={700} top={0} left={1000} color="blue" />
    <VerticalCategory {...cat7} cols={5} width={200} height={700} top={0} left={1250} color="lightblue" />
    <HorizontalCategory {...cat8} rows={4} width={780} height={160} top={750} left={670} />
  </div>




};

export default MainContent2;
