import React from 'react';
import _ from 'lodash'
import InternalLink from '../InternalLink';

const itemWidth = 36;
const itemHeight = 32;

const isLargeFn = (x) => x.cncfRelation && x.cncfRelation !== 'member';

const Item = function({zoom, item, x, y, isLarge, onSelectItem}) {
  if (isLarge) {
    return new LargeItem({zoom, item, x, y, onSelectItem});
  }
  const k = 1;
  return <div style={{
    cursor: 'pointer',
    position: 'absolute',
    left: (itemWidth * x) * zoom,
    top: (itemHeight * y) * zoom,
    width: (itemWidth  * k) * zoom,
    height: (itemHeight * k) * zoom }}>
    <img src={item.href} style={{
      width: (itemWidth * k - 2) * zoom,
      height: (itemHeight * k - 2) * zoom,
      margin: 2 * zoom,
      padding: 2 * zoom,
      border: `${1 * zoom}px solid grey`,
      borderRadius: 3 * zoom,
      background: item.oss ? '' : '#eee'
    }}
    onClick={ () => onSelectItem(item.id)}
  />
  </div>;
}

const LargeItem = function({zoom, item, x, y, onSelectItem}) {
  const k = 2;
  const z = function(x) {
    return Math.round(x * zoom * 2) / 2;
  };
  const color = {
    'sandbox': 'rgb(108, 165, 209)',
    'incubating': 'rgb(83, 113, 189)',
    'graduated': 'rgb(24, 54, 114)'
  }[item.cncfRelation];
  const label = {
    'sandbox': 'Cloud Native Sandbox',
    'incubating': 'CNCF Incubating',
    'graduated': 'CNCF Graduated'
  }[item.cncfRelation];
  return <div style={{
    cursor: 'pointer',
    position: 'absolute',
    border: `${z(2)}px solid ${color}`,
    left: (itemWidth * x + 3) * zoom,
    top: (itemHeight * y + 3) * zoom,
    width: (itemWidth  * k) * zoom,
    height: (itemHeight * k - 5) * zoom }}
    onClick={ () => onSelectItem(item.id)}
  >
    <img src={item.href} style={{
      width: (itemWidth * k - 2 - 5) * zoom,
      height: (itemHeight * k - 9 - 2 - 10) * zoom,
      margin: z(2),
      padding: z(2)
    }} />
  <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 10 * zoom, textAlign: 'center', background: color, color: 'white', fontSize: 6.7 * zoom, lineHeight: `${13 * zoom}px`}}>
    {label}
  </div>
  </div>;
}

const HorizontalSubcategory = function({zoom, subcategory, rows, onSelectItem, parentHeight, xRatio }) {
  const categoryHeight = rows;
  const total = _.sumBy(subcategory.allItems, function(item) {
    return isLargeFn(item) ? 4 : 1;
  });
  const filteredItems = subcategory.items;
  let cols = Math.max(Math.ceil(total / categoryHeight ), 2);
  // what if we have 3 cols but first 2 items are large cncf items, effectively
  // requiring 4 columns?
  if (cols % 2 === 1 && subcategory.allItems.slice(0, Math.trunc(cols / 2) + 1).every( (x) => isLargeFn(x))) {
    cols += 1;
  }
  const width = itemWidth * (cols - 1) * xRatio + itemWidth;
  const height = itemHeight * categoryHeight;
  const offset = (parentHeight - 20 - height) / 2;
  let x = 0;
  let y = 0;
  let busy = {};
  return <div style={{ width: width  * zoom, height: height * zoom, top: -40 * zoom, marginTop: (20 + offset) * zoom,  position: 'relative' }}>
    { filteredItems.map(function(item) {
      const isLarge = isLargeFn(item);
      const result = {key: item.name, zoom: zoom, item, y: y, x: x, isLarge: isLarge, onSelectItem: onSelectItem};
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
      return new Item({...result, x: result.x * xRatio});
    }) }
  </div>
};

const VerticalSubcategory = function({zoom, subcategory, cols, onSelectItem, xRatio}) {
  const categoryWidth = cols;
  const total = _.sumBy(subcategory.allItems, function(item) {
    return isLargeFn(item) ? 4 : 1;
  });
  const filteredItems = subcategory.items;
  const raws = Math.ceil(total / categoryWidth );
  const height = itemHeight * raws;
  const width  = itemWidth * categoryWidth;
  let x = 0;
  let y = 0;
  let busy = {};
  return <div style={{ left: 5 * zoom, width: width * zoom, height: height * zoom, position: 'relative' }}>
    { filteredItems.map(function(item) {
      const isLarge = isLargeFn(item);
      const result = {key: item.name, zoom: zoom, item, y: y, x: x, isLarge: isLarge, onSelectItem: onSelectItem};
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

      return new Item({...result, x: result.x * xRatio});
    }) }
  </div>
};

const getSubcategoryWidth = function({subcategory, rows}) {
  const categoryHeight = rows;
  const total = _.sumBy(subcategory.allItems, function(item) {
    return isLargeFn(item) ? 4 : 1;
  });
  const cols = Math.max(Math.ceil(total / categoryHeight ), 2);
  const width = itemWidth * cols;
  console.info(`Subcategory ${subcategory.name} has a width: ${width}`);
  return width;
}

const HorizontalCategory = function({header, subcategories, rows, width, height, top, left, zoom, color, href, onSelectItem, fitWidth}) {

  let innerWidth = _.sumBy(subcategories, (subcategory) =>  getSubcategoryWidth({subcategory, rows}));
  if (subcategories.length > 1) {
    console.info(`${header} has a width of ${innerWidth}, but expected width is ${width}`);
  }
  const xRatio = fitWidth ? (width - 50 ) / innerWidth : 1.05;

  return (
    <div style={{
      position: 'absolute', height: height * zoom, margin: 5 * zoom, width: width * zoom, top: (top - 5) * zoom, left: left * zoom
    }} >
      <div style={{transform: 'rotate(-90deg)', width: (height - 20) * zoom, height: 30 * zoom, top: ((height + 20) / 2 - 30 / 2) * zoom, left: (-(height / 2 - 30/2) + 20/2) * zoom, textAlign: 'center', position: 'absolute', background:color, color: 'white', fontSize: 13 * zoom}}>
        <InternalLink to={href}>
          <div style={{
            color: 'white',
            fontSize: 12 * zoom,
            position: 'absolute',
            width: '100%',
            transform: 'translate(-50%, -50%)',
            left: '50%',
            top:'50%'}}>{header}</div>
        </InternalLink>
      </div>
      <div style={{width: 40 * zoom, display: 'inline-block'}} />
      <div style={{position: 'absolute', border: `${1 * zoom}px solid ${color}`, background: 'white', top: 20 * zoom, bottom: 0, left: 30 * zoom, right: 0}}></div>
      <div style={{position: 'absolute', top: 20 * zoom, bottom: 0, left: 0, right: 0,
        boxShadow: `0 ${4 * zoom}px ${8 * zoom}px 0 rgba(0, 0, 0, 0.2), 0 ${6 * zoom}px ${20 * zoom}px 0 rgba(0, 0, 0, 0.19)`
      }}></div>
      <div style={{position: 'absolute', left: 35 * zoom, top: 0, right: 10 * zoom, bottom: 0, display: 'flex', justifyContent: 'space-between'}}>
        {subcategories.map(function(subcategory, index, all) {
          return [
            <div key={subcategory.name} style={{position: 'relative', fontSize: `${10 * zoom}px`}}>
              <div style={{position: 'relative', width: '100%', height: 40 * zoom, top: -14 * zoom}}>
                <span style={{textAlign: 'center', position: 'absolute', width: '100%', minWidth: 100 * zoom, transform: 'translate(-50%, -50%)', left: '50%', top:'50%'}}>
                  <InternalLink to={subcategory.href}>
                    <span style={{
                      color: 'white',
                      fontSize: 10 * zoom
                    }}>{subcategory.name}</span>
                  </InternalLink>
                </span>
              </div>
              <HorizontalSubcategory subcategory={subcategory} rows={rows} zoom={zoom} onSelectItem={onSelectItem} parentHeight={height} xRatio={xRatio} />
            </div>,
            index !== all.length - 1 && <div key={index} style={{ top: 40 * zoom, height: `calc(100% - ${50 * zoom}px)`, border: `${Math.max(Math.round(zoom) / 2, 0.5)}px solid #777`, position: 'relative' }}></div>
            ]
        })}
      </div>

  </div>);
}


const VerticalCategory = function({header, subcategories, cols = 6, top, left, width, height, color, zoom, href, onSelectItem}) {
  const xRatio = 1.07;
  return (<div style={{}}>
    <div style={{
      position: 'absolute', top: top -5 * zoom, left: left * zoom, height: height * zoom, margin: 5 * zoom, width: (width + 2) * zoom, background: 'white', border: `${1 * zoom}px solid ${color}`,
      boxShadow: `0 ${4 * zoom}px ${8 * zoom}px 0 rgba(0, 0, 0, 0.2), 0 ${6 * zoom}px ${20 * zoom}px 0 rgba(0, 0, 0, 0.19)`
    }}>
    <div style={{ width: width * zoom, height: 20 * zoom, lineHeight: `${20 * zoom}px`, textAlign: 'center', color: 'white', background: color, fontSize: 12 * zoom}}>
        <InternalLink to={href}>
          <span style={{
            color: 'white',
            fontSize: 12 * zoom
          }}>{header}</span>
        </InternalLink>
    </div>
      {subcategories.map(function(subcategory) {
        return <div key={subcategory.name} style={{position: 'relative'}}>
          <div style={{ fontSize: 10 * zoom, lineHeight: `${15 * zoom}px`, textAlign: 'center', color: color}}>
            <InternalLink to={subcategory.href}>
              <span style={{
                color: color,
                fontSize: 10 * zoom
              }}>{subcategory.name}</span>
            </InternalLink>
          </div>
          <VerticalSubcategory subcategory={subcategory} zoom={zoom} cols={cols} onSelectItem={onSelectItem} xRatio={xRatio} />
        </div>
      })}
    </div>
  </div>);
}

export {
  HorizontalCategory,
  VerticalCategory
};
