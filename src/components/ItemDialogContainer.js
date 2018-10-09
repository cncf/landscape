import { connect } from 'react-redux';
import createSelector from '../utils/createSelector';
import ItemDialog from './ItemDialog';

import { changeSelectedItemId, closeDialog } from '../reducers/mainReducer';
import getGroupedItems, {getGroupedItemsForBigPicture } from '../utils/itemsCalculator';
import selectedItemCalculator from '../utils/selectedItemCalculator';

const getSelectedItem = createSelector(
  [ getGroupedItems,
    getGroupedItemsForBigPicture,
    (state) => state.main.selectedItemId,
    (state) => state.main.mainContentMode !== 'card'
  ],
  function(groupedItems,groupedItemsForBigPicture, selectedItemId, isBigPicture) {
    const selectedItemInfo = selectedItemCalculator(groupedItems, groupedItemsForBigPicture, selectedItemId, isBigPicture);

    return {
      itemInfo: selectedItemInfo.itemInfo,
    };
  }
)
const mapStateToProps = (state) => ({
  ... getSelectedItem(state)
});
const mapDispatchToProps = {
  onClose: closeDialog,
  onSelectItem: changeSelectedItemId
};

export default connect(mapStateToProps, mapDispatchToProps)(ItemDialog);
