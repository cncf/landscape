import React from 'react';
import StarIcon from '@material-ui/icons/Star';
import millify from 'millify'
import classNames from 'classnames'
import ListSubheader from '@material-ui/core/ListSubheader';
import _ from 'lodash';
import InternalLink from './InternalLink';
import isEmbed from '../utils/isEmbed';
import isMobile from '../utils/isMobile';
import Delay from './DelayRender';

let oldItems = null;
const maxAnimatedElements = 100;
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

const Header =({groupedItem, itemRef, ...props}) => {
  return (
          <div ref={itemRef} className="sh_wrapper" key={"subheader:" + groupedItem.header} {...props}>
            <ListSubheader component="div" style={{fontSize: 24, paddingLeft: 16 }}>
              { groupedItem.href ?  <InternalLink  to={groupedItem.href}>{groupedItem.header}</InternalLink> : <span>{groupedItem.header}</span> }
              <span> ({groupedItem.items.length})</span></ListSubheader>
          </div>
  );
}

/*
 That is quite a complex component. It draws headers and cards, and also animates the difference
     - previous list of items is remembered every time, lately referenced as 'old'
     - we scroll to the top after every change, so we need to animate only those items which are at the start
     - if a card was visible with previous parameters and is visible with current parameters, we apply a 'move' animation
     - otherwise, old items fade out and new items fade in
     - for performance, we draw first 30 items with animations, and delay rendering of the remaining parts to provide a quicker response to the user
     - those 30 items are just an estimation, we calculate weather a card or a header are really visible in the current viewport or not
*/



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

  // RemainingContent does not use any animation at all
  const RemainingContent = function() {
    const result = _.map(groupedItems, function(groupedItem) {
      return [
        (function() {
          if (newItemsAndHeaderIds.indexOf(groupedItem.header) >= maxAnimatedElements) {
            return <Header groupedItem={groupedItem} />;
          }
          return [];
        })()
      ].concat(_.map(groupedItem.items, function(item) {
        if (newItemsAndHeaderIds.indexOf(item.id) >= maxAnimatedElements) {
          return <Card item={item} handler={handler} />;
        }
        return [];
      }));
    });
    return  _.flatten(result);
  }

  const delayedRemainingContent = <Delay key={Math.random()} delay={timeout * 2} content={ () => (<RemainingContent />) } />;
  let storage = {};

  function runAnimationWhenReady() {
    const isReady = animationsCounter === 0;
    if (isReady) {
      _.each(storage, function(value, key) {
        startAnimation(key);
      });
    }
  }

  function startAnimation(itemId) {
    const kind = storage[itemId]['kind'];
    if (kind === 'fadeIn') {
      startFadeInAnimation(itemId);
    }
    else if (kind === 'fadeOut') {
      startFadeOutAnimation(itemId);
    }
    else {
      startMovementAnimation(itemId);
    }
  }

  function startMovementAnimation(itemId) {
    const newEl = storage[itemId]['newEl'];
    const newRect = storage[itemId]['newRect'];
    const oldEl = storage[itemId]['oldEl'];
    const oldRect = storage[itemId]['oldRect'];
    const parentRect = storage[itemId]['parentRect'];
    const copy = storage[itemId]['newCopyEl'];
    if (!newRect || !oldRect || !copy) {
      return;
    }
    if (oldEl.getBoundingClientRect().top > window.innerHeight || newEl.getBoundingClientRect().top > window.innerHeight) {
      copy.style.opacity = 0;
      const transitionKind = `${timeout}ms linear 0ms`;

      newEl.style.opacity = 0;
      setTimeout(function() {
        newEl.style.transition = `opacity ${transitionKind}, transform ${transitionKind}`;
        newEl.style.opacity = 1;
      }, 1);

      oldEl.style.opacity = 1;
      setTimeout(function() {
        oldEl.style.transition = `opacity ${transitionKind}, transform ${transitionKind}`;
        oldEl.style.opacity = 0;
      }, 1);
    } else {
      copy.style.left = `${oldRect.x - parentRect.x}px`;
      copy.style.top = `${oldRect.y - parentRect.y}px`;
      copy.style.width = `${oldRect.width}px`;
      copy.style.height = `${oldRect.height}px`;
      copy.style.margin = '0';
      copy.style.zIndex = 1;
      const transitionKind = `${timeout}ms linear 0ms`;
      copy.style.opacity = 1;
      setTimeout(function() {
        copy.style.transition = `left ${transitionKind}, top ${transitionKind}, width ${transitionKind}, height ${transitionKind}`;
        copy.style.left = `${newRect.x - parentRect.x}px`;
        copy.style.top = `${newRect.y - parentRect.y}px`;
        copy.style.width = `${newRect.width}px`;
        copy.style.height = `${newRect.height}px`;
      }, 1);
      newEl.style.opacity = 0;
      oldEl.style.opacity = 0;
      setTimeout(function() {
        oldEl.style.opacity = 0;
        newEl.style.opacity = 1
        copy.style.opacity = 0;
      }, timeout * 1.5);
    }
  }

  function startFadeInAnimation(itemId) {
    const el = storage[itemId]['el'];
    const transitionKind = `${timeout}ms linear 0ms`;
    el.style.opacity = 0;
    setTimeout(function() {
      el.style.transition = `opacity ${transitionKind}`;
      el.style.opacity = 1;
    }, 1);
  }

  function startFadeOutAnimation(itemId) {
    const el = storage[itemId]['el'];
    const transitionKind = `${timeout}ms linear 0ms`;
    el.style.opacity = 1;
    setTimeout(function() {
      el.style.transition = `opacity ${transitionKind}`;
      el.style.opacity = 0;
    }, 1);
  }



  let animationsCounter = 0;
  function captureNew(itemId) {
    animationsCounter += 1;
    return function(x) {
      if (!x) {
        return;
      }
      animationsCounter -= 1;
      storage[itemId] = storage[itemId] || {};
      storage[itemId]['newRect'] = x.getBoundingClientRect();
      storage[itemId]['newEl'] = x;
      storage[itemId]['parentRect'] = x.parentNode.getBoundingClientRect();
      runAnimationWhenReady();
    }
  }

  function captureNewCopy(itemId) {
    animationsCounter += 1;
    return function(x) {
      if (!x) {
        return;
      }
      animationsCounter -= 1;
      storage[itemId] = storage[itemId] || {};
      storage[itemId]['newCopyEl'] = x;
      runAnimationWhenReady();
    }
  }

  function captureOld(itemId) {
    animationsCounter += 1;
    return function(x) {
      if (!x) {
        return;
      }
      animationsCounter -= 1;
      storage[itemId] = storage[itemId] || {};
      storage[itemId]['oldRect'] = x.getBoundingClientRect();
      storage[itemId]['oldEl'] = x;
      runAnimationWhenReady();
    }
  }

  function captureFadeIn(itemId) {
    animationsCounter += 1;
    itemId = itemId + 'new';
    return function(x) {
      if (!x) {
        return;
      }
      animationsCounter -= 1;
      storage[itemId] = storage[itemId] || {};
      storage[itemId]['el'] = x;
      storage[itemId]['kind'] = 'fadeIn';
      runAnimationWhenReady();
    }
  }

  function captureFadeOut(itemId) {
    animationsCounter += 1;
    itemId = itemId + 'old';
    return function(x) {
      if (!x) {
        return;
      }
      animationsCounter -= 1;
      storage[itemId] = storage[itemId] || {};
      storage[itemId]['el'] = x;
      storage[itemId]['kind'] = 'fadeOut';
      runAnimationWhenReady();
    }
  }

  function getItemsAndHeaders(grouped) {
    const result = _.map(grouped, function(groupedItem) {
      return [
        (function() {
          if (newItemsAndHeaderIds.indexOf(groupedItem.header) >= maxAnimatedElements) {
            return [];
          }
          const index = oldItemsAndHeaderIds.indexOf(groupedItem.header);
          const kind = index === -1 ? 'new' : index >= maxAnimatedElements ? 'up' : 'move';
          if (kind === 'new') {
            return (
              <Header key={Math.random()} itemRef={captureFadeIn(groupedItem.header)} groupedItem={groupedItem} />
            );
          }
          if (kind === 'move') {
            return [
              <Header key={Math.random()} itemRef={captureNew(groupedItem.header)} groupedItem={groupedItem} />,
              <Header key={Math.random()} itemRef={captureNewCopy(groupedItem.header)} groupedItem={groupedItem} style={{position: 'absolute'}}/>
            ];
          }
          if (kind === 'up') {
            // slide up via a same approach
            return (
              <Header key={Math.random()} itemRef={captureFadeIn(groupedItem.header)} groupedItem={groupedItem} />
            );
          }
        })()
      ].concat(_.map(groupedItem.items, function(item) {
        if (newItemsAndHeaderIds.indexOf(item.id) >= maxAnimatedElements) {
          return [];
        }
        const index = oldItemsAndHeaderIds.indexOf(item.id);
        const kind = index === -1 ? 'new' : index >= maxAnimatedElements ? 'up' : 'move';

        if (kind === 'new' || kind === 'up') {
          return (
              <Card key={Math.random()} itemRef={captureFadeIn(item.id)} item={item} handler={handler} />
          );
        }
        if (kind === 'move') {
          return [
            <Card itemRef={captureNew(item.id)} item={item} handler={handler} key={Math.random} />,
            <Card itemRef={captureNewCopy(item.id)} item={item} handler={handler} key={Math.random()} style={{position: 'absolute'}}/>
          ];
        }
      }));
    });
    return result;

  }

  function getOldItemsAndHeaders(grouped) {
    const result = _.map(grouped, function(groupedItem) {
      if (oldItemsAndHeaderIds.indexOf(groupedItem.header) >= maxAnimatedElements ) {
        return [];
      }
      return [
        (function() {
          const index = newItemsAndHeaderIds.indexOf(groupedItem.header);
          const kind = index === -1 ? 'old' : index < maxAnimatedElements ? 'move' : 'down';
          if (kind === 'old' || kind === 'down') {
            return (
              <Header key={Math.random()} itemRef={captureFadeOut(groupedItem.header)} groupedItem={groupedItem} />
            );
          }
          if (kind === 'move') {
            return <Header itemRef={captureOld(groupedItem.header)} groupedItem={groupedItem} />;
          }
        })()
      ].concat(_.map(groupedItem.items, function(item) {
        const index = newItemsAndHeaderIds.indexOf(item.id);
        const oldIndex = oldItemsAndHeaderIds.indexOf(item.id);
        if (oldIndex >= maxAnimatedElements) {
          return [];
        }
        const kind = index === -1 ? 'old' : index < maxAnimatedElements ? 'move' : 'down';
        if (kind === 'old' || kind === 'down') {
          return (
              <Card key={Math.random()} itemRef={captureFadeOut(item.id)} item={item} handler={handler} />
          );
        }
        if (kind === 'move') {
          return <Card itemRef={captureOld(item.id)} item={item} handler={handler} />;
        }
      }));
    });
    const limitedResult = _.flatten(result);
    return limitedResult;
  }


  const itemsAndHeaders = getItemsAndHeaders(groupedItems);
  const oldItemsAndHeaders = getOldItemsAndHeaders(oldItems);
  oldItems = groupedItems;

  const autoHide = function(ref) {
    if (ref) {
      ref.style.display = '';
      ref.style.position = 'absolute';
      ref.style.top = 0;
      ref.style.left = 0;
      setTimeout(function() {
        if (ref.style) {
          ref.style.display = 'none';
        }
      }, timeout * 1.5);
    }
  }

  return (
      <div className="column-content">
        { _.flatten(itemsAndHeaders) }
        { delayedRemainingContent }
        <div ref={autoHide} className="old-column-content" key={Math.random()}>
          { oldItemsAndHeaders }
        </div>
      </div>
  );
};

export default MainContent;
