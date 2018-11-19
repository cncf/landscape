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

let oldItems = null;
const MainContent = ({groupedItems, onSelectItem, onOpenItemInNewTab}) => {
  const handler = function(itemId) {
    const isSpecialMode = ( isMobile || window.innerWidth < 768 ) && isEmbed;
    isSpecialMode ? onOpenItemInNewTab(itemId) : onSelectItem(itemId);
  };

  function getItemsAndHeaders(grouped) {
    const result = _.map(grouped, function(groupedItem) {
      return [
        <Fade timeout="1000" in={true}>
          <div className="sh_wrapper" key={"subheader:" + groupedItem.header}>
            <ListSubheader component="div" style={{fontSize: 24, paddingLeft: 16 }}>
              { groupedItem.href ?  <InternalLink  to={groupedItem.href}>{groupedItem.header}</InternalLink> : <span>{groupedItem.header}</span> }
              <span> ({groupedItem.items.length})</span></ListSubheader>
          </div>
        </Fade>
      ].concat(_.map(groupedItem.items, function(item) {
        return (
          <Fade timeout="1000" in={true}>
            <div className="mosaic-wrap" key={item.id}>
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
        </Fade>
        );
      }));
    });
    return result;

  }


  const itemsAndHeaders = getItemsAndHeaders(groupedItems);
  const oldItemsAndHeaders = getItemsAndHeaders(oldItems);
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
