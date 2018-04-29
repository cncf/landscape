import React from 'react';
import Dialog from 'material-ui/Dialog';
import classNames from 'classnames'
import ItemDialogContent from './ItemDialogContent';
import ItemDialogButtonsContainer from './ItemDialogButtonsContainer';

import '../styles/itemModal.scss';
import isIphone from '../utils/isIphone';
import { CSSTransition } from 'react-transition-group';

const Transition = function(props) {
  return (
    <CSSTransition classNames="modal" {...props} timeout={500} />
  );
};

const ItemDialog = ({onClose, itemInfo}) => {
  if (!itemInfo) {
    return null;
  }
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
    <Dialog
      classes={{paper:'modal-body'}}
      transition={Transition}
      open={true}
      onClose={() => onClose()}
      className={classNames('modal', 'product', {sandbox : itemInfo.cncfRelation ==='sandbox'},
                                                 {incubating : itemInfo.cncfRelation ==='incubating'},
                                                 {graduated : itemInfo.cncfRelation ==='graduated'},
                                                 {nonoss : itemInfo.oss === false})}
      >
        <ItemDialogButtonsContainer/>
        <ItemDialogContent itemInfo={itemInfo}/>
    </Dialog>
  );
}
export default ItemDialog;
