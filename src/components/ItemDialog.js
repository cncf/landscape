import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import classNames from 'classnames'
import ItemDialogContent from './ItemDialogContent';
import ItemDialogButtonsContainer from './ItemDialogButtonsContainer';

import '../styles/itemModal.scss';
import isIphone from '../utils/isIphone';

let lastItemInfo;
const ItemDialog = ({onClose, itemInfo}) => {
  const recentItemInfo = itemInfo || lastItemInfo || {};
  if (itemInfo) {
    lastItemInfo = itemInfo;
  }
  if (isIphone) {
    if (!itemInfo) {
      return null;
    }
    return (
      <div className={classNames('modal', 'product', {sandbox : recentItemInfo.cncfRelation ==='sandbox'},
          {incubating : recentItemInfo.cncfRelation ==='incubating'},
          {graduated : recentItemInfo.cncfRelation ==='graduated'},
          {nonoss : recentItemInfo.oss === false})}
        >
          { /* Note - we move buttons away from here to the HomePage because of Safari Issues */ }
          { <ItemDialogContent itemInfo={itemInfo || lastItemInfo}/> }
        </div>
    )
  }
  return (
      <Dialog open={!!itemInfo} onClose={() => onClose() } transitionDuration={400}
        classes={{paper:'modal-body'}}
        className={classNames('modal', 'product', {sandbox : recentItemInfo.cncfRelation ==='sandbox'},
                                                  {incubating : recentItemInfo.cncfRelation ==='incubating'},
                                                  {graduated : recentItemInfo.cncfRelation ==='graduated'},
          {nonoss : recentItemInfo.oss === false})}
        >
          { itemInfo && <ItemDialogButtonsContainer/> }
          { (itemInfo || lastItemInfo) && <ItemDialogContent itemInfo={itemInfo || lastItemInfo}/> }
      </Dialog>
  );
}
export default ItemDialog;
