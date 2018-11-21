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
const maxAnimatedElements = 30;
const timeout = 3000;

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
  const delayedRemainingContent = <Delay key={Math.random()} delay={timeout} content={ () => (<RemainingContent />) } />;
  let storage = {};

  function runAnimationWhenReady() {
    // const isReady = _.every(_.keys(storage), function(key) {
      // const record = storage[key];
      // return (record['kind']) || (record['newRect'] && record['oldRect'] && record['newCopyEl']);
    // });
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
    copy.style.left = `${oldRect.x - parentRect.x}px`;
    copy.style.top = `${oldRect.y - parentRect.y}px`;
    copy.style.width = `${oldRect.width}px`;
    copy.style.height = `${oldRect.height}px`;
    copy.style.zIndex = 1;
    const transitionKind = `${timeout}ms linear 0ms`;
    copy.style.transition = `left ${transitionKind}, top ${transitionKind}, width ${transitionKind}, height ${transitionKind}`;
    copy.style.opacity = 1;
    setTimeout(function() {
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
    }, timeout);
  }

  function startFadeInAnimation(itemId) {
    const el = storage[itemId]['el'];
    const transitionKind = `${timeout}ms linear 0ms`;
    el.style.opacity = 0;
    el.style.transform = 'scale(0.1)';
    el.style.transition = `opacity ${transitionKind}, transform ${transitionKind}`;
    setTimeout(function() {
      el.style.opacity = 1;
      el.style.transform = 'scale(1.0)';
    }, 1);
  }

  function startFadeOutAnimation(itemId) {
    const el = storage[itemId]['el'];
    const transitionKind = `${timeout}ms linear 0ms`;
    el.style.opacity = 1;
    el.style.transform = 'scale(1.0)';
    el.style.transition = `opacity ${transitionKind}, transform ${transitionKind}`;
    setTimeout(function() {
      el.style.opacity = 0;
      el.style.transform = 'scale(0.1)';
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

  function captureUp(itemId) {
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
      storage[itemId]['oldRect'] = {
        x: storage[itemId]['newRect'].x,
        y: storage[itemId]['newRect'].y + window.innerHeight,
        width: storage[itemId]['newRect'].width,
        height: storage[itemId]['newRect'].height,
      }
      storage[itemId]['oldEl'] = document.createElement('div');
      runAnimationWhenReady();
    }
  }

  function captureDown(itemId) {
    animationsCounter += 1;
    return function(x) {
      if (!x) {
        return;
      }
      animationsCounter -= 1;
      storage[itemId] = storage[itemId] || {};
      storage[itemId]['oldRect'] = x.getBoundingClientRect();
      storage[itemId]['oldEl'] = x;
      storage[itemId]['parentRect'] = x.parentNode.getBoundingClientRect();
      storage[itemId]['newRect'] = {
        x: storage[itemId]['oldRect'].x,
        y: storage[itemId]['oldRect'].y + window.innerHeight,
        width: storage[itemId]['oldRect'].width,
        height: storage[itemId]['oldRect'].height,
      }
      storage[itemId]['newEl'] = document.createElement('div');
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
          } else {
            return (
              <Header key={Math.random()} itemRef={captureFadeIn(groupedItem.header)} groupedItem={groupedItem} style={{opacity: 0, transform: 'scale(0.1)'}} />
            );
          }
        })()
      ].concat(_.map(groupedItem.items, function(item) {
        if (newItemsAndHeaderIds.indexOf(item.id) >= maxAnimatedElements) {
          return [];
        }
        const index = oldItemsAndHeaderIds.indexOf(item.id);
        const kind = index === -1 ? 'new' : index >= maxAnimatedElements ? 'up' : 'move';
        console.info(item.id, kind);

        if (kind === 'new') {
          return (
              <Card key={Math.random()} itemRef={captureFadeIn(item.id)} item={item} handler={handler} style={{opacity: 0, transform: 'scale(0.1)'}} />
          );
        }
        if (kind === 'move') {
          return [
            <Card itemRef={captureNew(item.id)} item={item} handler={handler} key={Math.random} />,
            <Card itemRef={captureNewCopy(item.id)} item={item} handler={handler} style={{position: 'absolute', opacity: 0}} key={Math.random()} />
          ];
        }
        if (kind === 'up') {
          // slide up via a same approach
          return [
            <Card itemRef={captureUp(item.id)} item={item} handler={handler} key={Math.random} />,
            <Card itemRef={captureNewCopy(item.id)} item={item} handler={handler} style={{position: 'absolute', opacity: 0}} key={Math.random()} />
          ]
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
          <Header key={Math.random()} itemRef={captureFadeOut(groupedItem.header)} groupedItem={groupedItem} style={{opacity: 1}} />
      ].concat(_.map(groupedItem.items, function(item) {
        const index = newItemsAndHeaderIds.indexOf(item.id);
        const oldIndex = oldItemsAndHeaderIds.indexOf(item.id);
        if (oldIndex >= maxAnimatedElements) {
          return [];
        }
        const kind = index === -1 ? 'old' : index < maxAnimatedElements ? 'move' : 'down';
        console.info(item.id, kind);
        if (kind === 'old') {
          return (
              <Card key={Math.random()} itemRef={captureFadeOut(item.id)} item={item} handler={handler} style={{opacity: 1}} />
          );
        }
        if (kind === 'move') {
          return <Card itemRef={captureOld(item.id)} item={item} handler={handler} style={{opacity: 1}} />;
        }
        if (kind === 'down') {
          return [
            <Card itemRef={captureDown(item.id + 'old')} item={item} handler={handler} key={Math.random} />,
            <Card itemRef={captureNewCopy(item.id + 'old')} item={item} handler={handler} style={{position: 'absolute', opacity: 0}} key={Math.random()} />
          ]
        }
      }));
    });
    const limitedResult = _.flatten(result);
    return limitedResult;
  }


  const itemsAndHeaders = getItemsAndHeaders(groupedItems);
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
        { delayedRemainingContent }
        <div ref={autoHide} style={{display: '', position: 'absolute', top: 0, left: 0}} className="old-column-content" key={Math.random()}>
          { oldItemsAndHeaders }
        </div>
      </div>
  );
};

export default MainContent;
