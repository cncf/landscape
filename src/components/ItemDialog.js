import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import classNames from 'classnames'
import ItemDialogContent from './ItemDialogContent';
import ItemDialogButtonsContainer from './ItemDialogButtonsContainer';
import HorizontalFlipTransition from './HorizontalFlipTransition';

import '../styles/itemModal.scss';
import isIphone from '../utils/isIphone';

const ItemDialog = ({onClose, itemInfo}) => {
  if (isIphone) {
    return (
      <div className={classNames('modal', 'product', {sandbox : itemInfo.cncfRelation ==='sandbox'},
          {incubating : itemInfo.cncfRelation ==='incubating'},
          {graduated : itemInfo.cncfRelation ==='graduated'},
          {nonoss : itemInfo.oss === false})}
        >
          { /* Note - we move buttons away from here to the HomePage because of Safari Issues */ }
          <ItemDialogContent itemInfo={itemInfo}/>
        </div>
    )
  }
  return (
      <Dialog open={!!itemInfo} onClose={() => onClose() } transitionDuration={500} TransitionComponent = {HorizontalFlipTransition}
        classes={{paper:'modal-body'}}
        className={classNames('modal', 'product')}>
          {itemInfo && <ItemDialogButtonsContainer/> }
          { itemInfo && <ItemDialogContent itemInfo={itemInfo}/> }
      </Dialog>
  );
}
export default ItemDialog;
