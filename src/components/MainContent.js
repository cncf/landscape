import React from 'react';
import StarIcon from '@material-ui/icons/Star';
import millify from 'millify'
import classNames from 'classnames'
import ListSubheader from '@material-ui/core/ListSubheader';
import _ from 'lodash';
import InternalLink from './InternalLink';
import isEmbed from '../utils/isEmbed';
import isMobile from '../utils/isMobile';
import Fade from '@material-ui/core/Fade';
import FadeOut from './FadeOut';

let oldItems = null;
const maxAnimatedElements = 30;
const timeout = 1000;

const Card = ({item, handler, itemRef, ...props}) => {
  return (
            <div ref={itemRef} className="mosaic-wrap" key={item.id} {...props}>
            <div className={classNames('mosaic',{sandbox : item.cncfRelation ==='sandbox'},
              {incubating : item.cncfRelation ==='incubating'},
              {graduated : item.cncfRelation ==='graduated'},
              {nonoss : item.oss === false})}
              onClick={() => handler(item.id)} >
              <div className="logo_wrapper">
                <img src={item.href} className='logo' max-height='100%' max-width='100%' />
              </div>
              <div className="mosaic-info">
                <div>
                  <h5>{item.name}</h5>
                  {item.organization}
                </div>
                <div className="mosaic-stars">
                  { _.isNumber(item.stars) && item.stars &&
                      <div>
                        <StarIcon color="disabled" style={{ fontSize: 15 }}/>
                        <span style={{position: 'relative', top: -3}}>{item.starsAsText}</span>
                      </div>
                  }
                  { Number.isInteger(item.amount) &&
                      <div className="mosaic-funding">{item.amountKind === 'funding' ? 'Funding: ': 'MCap: '} {'$'+ millify( item.amount )}</div>
                  }
                </div>
              </div>
            </div>
          </div>
  );
}

const Header =({groupedItem, ...props}) => {
  return (
          <div className="sh_wrapper" key={"subheader:" + groupedItem.header} {...props}>
            <ListSubheader component="div" style={{fontSize: 24, paddingLeft: 16 }}>
              { groupedItem.href ?  <InternalLink  to={groupedItem.href}>{groupedItem.header}</InternalLink> : <span>{groupedItem.header}</span> }
              <span> ({groupedItem.items.length})</span></ListSubheader>
          </div>
  );

}
const MainContent = ({groupedItems, onSelectItem, onOpenItemInNewTab}) => {
  const handler = function(itemId) {
    const isSpecialMode = ( isMobile || window.innerWidth < 768 ) && isEmbed;
    isSpecialMode ? onOpenItemInNewTab(itemId) : onSelectItem(itemId);
  };

  const newItemsAndHeaderIds = _.flatten(_.map(groupedItems, function(x) {
    return [x.header].concat(x.items.map( (y) => y.id ));
  }));
  const oldItemsAndHeaderIds = _.flatten(_.map(oldItems, function(x) {
    return [x.header].concat(x.items.map( (y) => y.id ));
  }));

  let storage = {};

  function startAnimation(item) {
    const newEl = storage[item.id]['newEl'];
    const newRect = storage[item.id]['newRect'];
    const oldEl = storage[item.id]['oldEl'];
    const oldRect = storage[item.id]['oldRect'];
    const parentRect = storage[item.id]['parentRect'];
    const copy = storage[item.id]['newCopyEl'];
    if (!newRect || !oldRect || !copy) {
      return;
    }
    copy.style.left = `${oldRect.x - parentRect.x}px`;
    copy.style.top = `${oldRect.y - parentRect.y}px`;
    copy.style.zIndex = 1;
    copy.style.transition = `left ${timeout / 2}ms linear 0s, top ${timeout / 2}ms linear 0s`;
    setTimeout(function() {
      copy.style.left = `${newRect.x - parentRect.x}px`;
      copy.style.top = `${newRect.y - parentRect.y}px`;
    }, 1);
    newEl.style.opacity = 0;
    oldEl.style.opacity = 0;
    setTimeout(function() {
      oldEl.style.opacity = 0;
      newEl.style.opacity = 1
      copy.style.opacity = 0;
    }, timeout);
  }


  function captureNew(item) {
    return function(x) {
      if (!x) {
        return;
      }
      storage[item.id] = storage[item.id] || {};
      storage[item.id]['newRect'] = x.getBoundingClientRect();
      storage[item.id]['newEl'] = x;
      storage[item.id]['parentRect'] = x.parentNode.getBoundingClientRect();
      startAnimation(item);
    }
  }
  function captureNewCopy(item) {
    return function(x) {
      if (!x) {
        return;
      }
      storage[item.id] = storage[item.id] || {};
      storage[item.id]['newCopyEl'] = x;
      startAnimation(item);
    }

  }

  function captureOld(item) {
    return function(x) {
      if (!x) {
        return;
      }
      storage[item.id] = storage[item.id] || {};
      storage[item.id]['oldRect'] = x.getBoundingClientRect();
      storage[item.id]['oldEl'] = x;
      startAnimation(item);
    }
  }


  function getItemsAndHeaders(grouped, visible) {
    let counter = 0;
    const result = _.map(grouped, function(groupedItem) {
      counter += 1;
      return [
        (function() {
          if (counter > maxAnimatedElements) {
            return <Header groupedItem={groupedItem} />;
          } else {
            return (
              <Fade timeout={timeout} in={visible}>
                <Header groupedItem={groupedItem} />
              </Fade>
            );
          }
        })()
      ].concat(_.map(groupedItem.items, function(item) {
        counter += 1;
        if (counter > maxAnimatedElements) {
          return <Card item={item} handler={handler} />;
        }
        const index = oldItemsAndHeaderIds.indexOf(item.id);
        const kind = index === -1 ? 'new' : index >= maxAnimatedElements ? 'up' : 'move';
        console.info(item.id, kind);

        if (kind === 'new') {
          return (
            <Fade timeout={timeout} in={visible} key={Math.random()}>
              <Card item={item} handler={handler} />
            </Fade>
          );
        }
        if (kind === 'move') {
          return [
            <Card itemRef={captureNew(item)} item={item} handler={handler} />,
            <Card itemRef={captureNewCopy(item)} item={item} handler={handler} style={{position: 'absolute'}} />
          ];
        }
        if (kind === 'up') {
          // TODO: slide up animation
          <Fade timeout={timeout} in={visible} key={Math.random()}>
            <Card item={item} handler={handler} />
          </Fade>
        }
      }));
    });
    return result;

  }

  function getOldItemsAndHeaders(grouped) {
    let counter = 0;
    const result = _.map(grouped, function(groupedItem) {
      counter += 1;
      if (counter > maxAnimatedElements) {
        return [];
      }
      return [
        <FadeOut timeout={timeout} in={true} key={Math.random()}>
          <Header groupedItem={groupedItem} />
        </FadeOut>
      ].concat(_.map(groupedItem.items, function(item) {
        counter += 1;
        const index = newItemsAndHeaderIds.indexOf(item.id);
        const kind = index === -1 ? 'old' : index >= maxAnimatedElements ? 'down' : 'move';
        console.info(item.id, kind);
        if (kind === 'old') {
          return (
            <FadeOut timeout={timeout} in={true} key={Math.random()}>
              <Card item={item} handler={handler} />
            </FadeOut>
          );
        }
        if (kind === 'move') {
          return <Card itemRef={captureOld(item)} item={item} handler={handler} style={{opacity: 1}} />;
        }
        if (kind === 'down') {
          return <Card item={item} handler={handler} style={{opacity: 0}} />;
        }
      }));
    });
    const limitedResult = _.flatten(result).slice(0, maxAnimatedElements);
    return limitedResult;
  }


  const itemsAndHeaders = getItemsAndHeaders(groupedItems, true);
  const oldItemsAndHeaders = getOldItemsAndHeaders(oldItems);
  oldItems = groupedItems;
  console.info('old: ',oldItemsAndHeaders);

  const autoHide = function(ref) {
    if (ref) {
      ref.style.display = '';
      setTimeout(function() {
        if (ref.style) {
          ref.style.display = 'none';
        }
      }, timeout);
    }
  }

  return (
      <div className="column-content">
          { _.flatten(itemsAndHeaders) }
        <div ref={autoHide} style={{display: '', position: 'absolute', top: 0, left: 0}} className="old-column-content" key={Math.random()}>
          { oldItemsAndHeaders }
        </div>
      </div>
  );
};

export default MainContent;
