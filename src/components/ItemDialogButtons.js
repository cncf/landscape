import React from 'react';
import Icon from 'material-ui/Icon';
import KeyHandler from 'react-key-handler';

import '../styles/itemModal.scss';

const ItemDialogButtons = ({hasSelectedItem, onClose, previousItemId, nextItemId, onSelectItem }) => {
  if (!hasSelectedItem) {
    return null;
  }
  return (
    <div className='modal-buttons'>
          { nextItemId && <KeyHandler keyValue="ArrowRight" onKeyHandle={() => onSelectItem(nextItemId)} /> }
          { previousItemId && <KeyHandler keyValue="ArrowLeft" onKeyHandle={() => onSelectItem(previousItemId)} /> }
          <a className="modal-close" onClick={() => onClose()}>×</a>
          <span className="modal-prev" disabled={!previousItemId} onClick={() => onSelectItem(previousItemId)}>
            <Icon style={{ fontSize:'1.2em'}}>chevron_left</Icon>
          </span>
          <span className="modal-next" disabled={!nextItemId} onClick={() => onSelectItem(nextItemId)}>
            <Icon style={{ fontSize:'1.2em'}}>chevron_right</Icon>
          </span>
    </div>
  );
}
export default ItemDialogButtons;
