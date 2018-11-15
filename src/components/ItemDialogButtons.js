import React from 'react';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
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
          <span className="modal-prev" disabled={!previousItemId} onClick={(e) => {e.stopPropagation(); onSelectItem(previousItemId)}}>
            <ChevronLeftIcon style={{ fontSize:'1.2em'}} />
          </span>
          <span className="modal-next" disabled={!nextItemId} onClick={(e) => {e.stopPropagation(); onSelectItem(nextItemId)}}>
            <ChevronRightIcon style={{ fontSize:'1.2em'}} />
          </span>
    </div>
  );
}
export default ItemDialogButtons;
