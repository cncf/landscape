import React from 'react';

const category1 = {
  name: 'App Definition and Development',
  subcategories: [{
    name: 'a1',
    items: []
  }, {
    name: 'a2',
    items: []
  }]
};

const category2 = {
  name: 'Orchestration & Management',
  subcategories: [{
    name: 'b1',
    items: []
  }, {
    name: 'b2',
    items: []
  }, {
    name: 'b3',
    items: []
  }]
};


const drawCategory = function({name, subcategories}) {
  return (<div style={{}}>
    <div style={{position: 'relative', height: '200px', margin: '5px', width: '500px', background: 'lightblue'}} ><div style={{transform: 'rotate(-90deg)', width: '200px', height: '30px', top: '85px', left: '-85px', textAlign: 'center', position: 'absolute', background: 'red'}}>{name}</div>
      {subcategories.map(function(subcategory) {
        return <div style={{}}><span>{subcategory.name}</span>
          {subcategory.items.map(function(item) {
            return <div>{item.name}</div>
          }) }
        </div>
      })}


    </div>
  </div>);
}


const MainContent2 = ({groupedItems, onSelectItem, onOpenItemInNewTab}) => {
  return <div>
    { drawCategory(category1) }
    { drawCategory(category2) }
  </div>




};

export default MainContent2;
