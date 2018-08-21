import { connect } from 'react-redux';
import createSelector from '../utils/createSelector';
import _ from 'lodash';
import ItemDialog from './ItemDialog';

import { changeSelectedItemId, closeDialog } from '../reducers/mainReducer';
import getGroupedItems, {getGroupedItemsForBigPicture } from '../utils/itemsCalculator';

const getSelectedItem = createSelector(
  [ getGroupedItems,
    getGroupedItemsForBigPicture,
    (state) => state.main.selectedItemId,
    (state) => state.main.isBigPicture
  ],
  function(groupedItems,groupedItemsForBigPicture, selectedItemId, isBigPicture) {
    const calcItems = function() {
      if (!isBigPicture) {
        return _.flatten(_.map(groupedItems, 'items'));
      }
      // if we are in a big picture mode, we want to allow prev/next button to work only inside a given category
      const allItems = groupedItemsForBigPicture.map((x) => _.flatten(x.subcategories.map( (subcategory) => subcategory.items)));
      const itemsBelongingToCategory = allItems.filter(function(arr) {
        return !! _.find(arr, {id: selectedItemId});
      });
      return itemsBelongingToCategory[0] || [];
    }
    const items = calcItems();
    const index = _.findIndex(items, {id: selectedItemId});
    const item = items[index];
    return {
      itemInfo: item,
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
