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
const timeout = 1000;

const Card = ({item, handler, ...props}) => {
  return (
            <div className="mosaic-wrap" key={item.id} {...props}>
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

  function getItemsAndHeaders(grouped, visible) {
    const result = _.map(grouped, function(groupedItem) {
      return [
        <Fade timeout={timeout} in={visible}>
          <Header groupedItem={groupedItem} />
        </Fade>
      ].concat(_.map(groupedItem.items, function(item) {
        return (
          <Fade timeout={timeout} in={visible}>
            <Card item={item} handler={handler} />
        </Fade>
        );
      }));
    });
    return result;

  }

  function getOldItemsAndHeaders(grouped) {
    const result = _.map(grouped, function(groupedItem) {
      return [
        <FadeOut timeout={timeout} in={true}>
          <Header groupedItem={groupedItem} />
        </FadeOut>
      ].concat(_.map(groupedItem.items, function(item) {
        return (
          <FadeOut timeout={timeout} in={true} key={Math.random()}>
            <Card item={item} handler={_.identity} />
        </FadeOut>
        );
      }));
    });
    const limitedResult = _.flatten(result).slice(0, 30);
    return limitedResult;
  }


  const itemsAndHeaders = getItemsAndHeaders(groupedItems, true);
  const oldItemsAndHeaders = getOldItemsAndHeaders(oldItems);
  oldItems = groupedItems;

  return (
      <div className="column-content">
          { _.flatten(itemsAndHeaders) }
        <div style={{position: 'absolute', top: 0, left: 0}} className="old-column-content">
          { _.flatten(oldItemsAndHeaders) }
        </div>
      </div>
  );
};

export default MainContent;
