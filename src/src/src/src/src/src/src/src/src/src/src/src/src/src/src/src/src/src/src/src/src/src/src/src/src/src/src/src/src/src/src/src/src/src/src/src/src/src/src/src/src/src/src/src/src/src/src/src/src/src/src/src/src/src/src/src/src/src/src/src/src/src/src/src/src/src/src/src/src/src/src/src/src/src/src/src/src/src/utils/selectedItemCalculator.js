import _ from 'lodash';
export default function(groupedItems,groupedItemsForBigPicture, selectedItemId, isBigPicture) {
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
    const nextItem = items[index + 1];
    const previousItem = items[index - 1];
    return {
      itemInfo: item,
      hasSelectedItem: !!item,
      nextItemId: (nextItem || {id: null}).id,
      previousItemId: (previousItem || {id: null}).id
    };
  }
