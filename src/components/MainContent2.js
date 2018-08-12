import React from 'react';
import _ from 'lodash';

const categoryHeight = 5;
const itemWidth = 30;
const itemHeight = 30;

const drawItem = function({item, x, y, isLarge}) {
  const k = isLarge ? 2 : 1;
  return <div style={{ position: 'absolute', left: itemWidth * x, top: itemHeight * y, border: '1px solid green', width: itemWidth  * k, height: itemHeight * k }}>
    <img src={item.href} style={{ maxHeight: itemWidth * k - 5, maxWidth:itemHeight * k - 5}} />
  </div>;
}

const drawSubcategory = function(subcategory) {
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

const drawSeparator = function() {
  return <div style={{ right: 10, top: 15, bottom: 5, background: 'black', width: 1, position: 'absolute' }}></div>

}

const drawCategory = function({header, subcategories}) {
  return (<div style={{}}>
    <div style={{position: 'relative', height: '200px', margin: '5px', width: '1200px', background: 'lightblue'}} ><div style={{transform: 'rotate(-90deg)', width: '200px', height: '30px', top: '85px', left: '-85px', textAlign: 'center', position: 'absolute', background: 'red'}}>{header}</div>
      <div style={{width: 40, display: 'inline-block'}} />
      {subcategories.map(function(subcategory, index, all) {
        return <div style={{position: 'relative', display: 'inline-block', fontSize: '8px'}}><span>{subcategory.name}</span>
          { drawSubcategory(subcategory) }
          { index !== all.length - 1 && drawSeparator() }
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
  return <div>
    { drawCategory(cat1) }
    { drawCategory(cat2) }
    { drawCategory(cat3) }
    { drawCategory(cat4) }
  </div>




};

export default MainContent2;
