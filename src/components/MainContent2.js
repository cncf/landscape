import React from 'react';
import _ from 'lodash';

const categoryHeight = 5;
const itemWidth = 30;
const itemHeight = 30;

const drawItem = function({item, x, y}) {
  return <div style={{ position: 'absolute', left: itemWidth * x, top: itemHeight * y, border: '1px solid green', width: itemWidth, height: itemHeight }}>
    <img src={item.href} style={{ maxHeight:'25px', maxWidth: '25px'}} />
  </div>;
}

const drawSubcategory = function(subcategory) {
  const cols = Math.ceil(subcategory.items.length / categoryHeight );
  const width = itemWidth * cols;
  const height = itemHeight * categoryHeight;
  return <div style={{ border: '1px solid black', width: width, height: height, position: 'relative' }}>
    { subcategory.items.map(function(item, index) {
      return drawItem({item, y: Math.trunc(index / cols), x: index % cols })
    }) }
  </div>
};

const drawCategory = function({header, subcategories}) {
  return (<div style={{}}>
    <div style={{position: 'relative', height: '200px', margin: '5px', width: '1200px', background: 'lightblue'}} ><div style={{transform: 'rotate(-90deg)', width: '200px', height: '30px', top: '85px', left: '-85px', textAlign: 'center', position: 'absolute', background: 'red'}}>{header}</div>
      {subcategories.map(function(subcategory) {
        return <div style={{position: 'relative', left: '40px', display: 'inline-block', fontSize: '8px'}}><span>{subcategory.name}</span>
          { drawSubcategory(subcategory) }
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
