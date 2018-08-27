import React from 'react';
import _ from 'lodash'
import InternalLink from '../InternalLink';

const itemWidth = 36;
const itemHeight = 32;

const Item = function({item, x, y, isLarge, onSelectItem}) {
  if (isLarge) {
    return new LargeItem({item, x, y, onSelectItem});
  }
  const k = 1;
  return <div style={{
    cursor: 'pointer',
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
      background: item.oss ? '' : '#eee'
    }}
    onClick={ () => onSelectItem(item.id)}
  />
  </div>;
}

const LargeItem = function({item, x, y, onSelectItem}) {
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
    cursor: 'pointer',
    position: 'absolute',
    border: `2px solid ${color}`,
    left: itemWidth * x + 5 + 3,
    top: itemHeight * y + 3,
    width: itemWidth  * k - 6,
    height: itemHeight * k - 6 }}
    onClick={ () => onSelectItem(item.id)}
  >
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

const HorizontalSubcategory = function({subcategory, rows, onSelectItem, parentHeight}) {
  const categoryHeight = rows;
  const total = _.sumBy(subcategory.items, function(item) {
    return item.cncfProject ? 4 : 1;
  });
  const items = subcategory.items;
  const cols = Math.max(Math.ceil(total / categoryHeight ), 2);
  const width = itemWidth * cols;
  const height = itemHeight * categoryHeight;
  const offset = (parentHeight - 20 - height) / 2;
  let x = 0;
  let y = 0;
  let busy = {};
  return <div style={{ width: width + 20, height: height, marginTop: 20 + offset,  position: 'relative' }}>
    { items.map(function(item) {
      const isLarge = !!item.cncfProject;
      const result = {item, y: y, x: x, isLarge: isLarge, onSelectItem: onSelectItem};
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

      return new Item(result);
    }) }
  </div>
};

const VerticalSubcategory = function({subcategory, cols, onSelectItem}) {
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
      const result = {item, y: y, x: x, isLarge: isLarge, onSelectItem: onSelectItem};
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

      return new Item(result);
    }) }
  </div>
};

const Separator = function() {
  return <div style={{ right: 5, top: 35, bottom: 5, background: 'black', width: 1, position: 'absolute' }}></div>

}

const HorizontalCategory = function({header, subcategories, rows, width, height, top, left, color, href, onSelectItem}) {
  return (
    <div style={{position: 'absolute', height: height, margin: '5px', width: width, top: top - 5, left: left}} >
      <div style={{transform: 'rotate(-90deg)', width: height - 20, height: 30, top: (height + 20) / 2 - 30 / 2, left: -(height / 2 - 30/2) + 20/2, textAlign: 'center', position: 'absolute', background:color, color: 'white', fontSize: 13, lineHeight: '30px'}}>
        <InternalLink to={href}>
          <span style={{
            color: 'white',
            fontSize: 13,
            lineHeight: '30px'
          }}>{header}</span>
        </InternalLink>
      </div>
      <div style={{width: 40, display: 'inline-block'}} />
      <div style={{position: 'absolute', border: `1px solid ${color}`, background: 'white', top: 20, bottom: 0, left: 30, right: 0}}>

      </div>
      {subcategories.map(function(subcategory, index, all) {
        return <div style={{position: 'relative', display: 'inline-block', fontSize: '10px'}}>
          <span style={{textAlign: 'center', position: 'absolute', width: '100%', minWidth: 100, transform: 'translate(-50%, 0%)', left: '50%'}}>
            <InternalLink to={subcategory.href}>
              <span style={{
                color: 'white',
                fontSize: 10
              }}>{subcategory.name}</span>
            </InternalLink>
          </span>
          <HorizontalSubcategory subcategory={subcategory} rows={rows} onSelectItem={onSelectItem} parentHeight={height} />
          { index !== all.length - 1 && <Separator /> }
        </div>
      })}

  </div>);
}

const VerticalCategory = function({header, subcategories, cols = 6, top, left, width, height, color, href, onSelectItem}) {
  return (<div style={{}}>
    <div style={{
      position: 'absolute', top: top -5, left: left, height: height, margin: 5, width: width, background: 'white', border: `1px solid ${color}`
    }} >
    <div style={{ width: width, height: 20, lineHeight: '20px', textAlign: 'center', color: 'white', background: color, fontSize: 12}}>
        <InternalLink to={href}>
          <span style={{
            color: 'white',
            fontSize: 12
          }}>{header}</span>
        </InternalLink>
    </div>
      {subcategories.map(function(subcategory) {
        return <div style={{position: 'relative'}}>
          <div style={{ fontSize: '10px', lineHeight: '15px', textAlign: 'center', color: color}}>
            <InternalLink to={subcategory.href}>
              <span style={{
                color: color,
                fontSize: 10
              }}>{subcategory.name}</span>
            </InternalLink>
          </div>
          <VerticalSubcategory subcategory={subcategory} cols={cols} onSelectItem={onSelectItem} />
        </div>
      })}
    </div>
  </div>);
}

export {
  HorizontalCategory,
  VerticalCategory
};
