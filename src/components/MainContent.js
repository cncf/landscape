import React from 'react';
import Icon from 'material-ui/Icon';
import millify from 'millify'
import classNames from 'classnames'
import Subheader from 'material-ui/List/ListSubheader';
import _ from 'lodash';
import InternalLink from './InternalLink';
import isEmbed from '../utils/isEmbed';
import isMobile from '../utils/isMobile';

const MainContent = ({groupedItems, onSelectItem, onOpenItemInNewTab}) => {
  const handler = function(itemId) {
    const isSpecialMode = ( isMobile || window.innerWidth < 768 ) && isEmbed;
    isSpecialMode ? onOpenItemInNewTab(itemId) : onSelectItem(itemId);
  };
  const itemsAndHeaders = _.map(groupedItems, function(groupedItem) {
    return [
      <div className="sh_wrapper" key={"subheader:" + groupedItem.header}>
        <Subheader component="div" style={{fontSize: 24}}>
          { groupedItem.href ?  <InternalLink  to={groupedItem.href}>{groupedItem.header}</InternalLink> : <span>{groupedItem.header}</span> }
          <span> ({groupedItem.items.length})</span></Subheader>
      </div>
    ].concat(_.map(groupedItem.items, function(item) {
      return (<div className="mosaic-wrap">
        <div className="mosaic-link" key={item.id} onClick={() => handler(item.id)} >

          <div className={classNames('mosaic',{sandbox : item.cncfRelation ==='sandbox'},
                                              {incubating : item.cncfRelation ==='incubating'},
                                              {graduated : item.cncfRelation ==='graduated'},
                                              {nonoss : item.oss === false})}>
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
                    <Icon color="disabled" style={{ fontSize: 15 }}>star</Icon>
                    <span>{item.starsAsText}</span>
                  </div>
                }
                { Number.isInteger(item.amount) &&
                    <div className="mosaic-funding">{item.amountKind === 'funding' ? 'Funding: ': 'MCap: '} {'$'+ millify( item.amount )}</div>
                }
              </div>
            </div>
          </div>
          <div className="mosaic-back">
            <h5>{item.name}</h5>
            {item.description}
          </div>
        </div>
      </div>);
    }));
  });
  return (
      <div className="column-content">
      { _.flatten(itemsAndHeaders) }
    </div>
  );
};

export default MainContent;
