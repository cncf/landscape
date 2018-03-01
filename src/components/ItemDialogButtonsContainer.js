import { connect } from 'react-redux';
import createSelector from '../utils/createSelector';
import _ from 'lodash';
import ItemDialogButtons from './ItemDialogButtons';

import { changeSelectedItemId, closeDialog } from '../reducers/mainReducer';
import getGroupedItems from '../utils/itemsCalculator';

const getSelectedItem = createSelector(
  [ getGroupedItems, (state) => state.main.selectedItemId ],
  function(groupedItems, selectedItemId) {
    const items = _.flatten(_.map(groupedItems, 'items'));
    const index = _.findIndex(items, {id: selectedItemId});
    const item = items[index];
    const nextItem = items[index + 1];
    const previousItem = items[index - 1];
    return {
      hasSelectedItem: !!item,
      nextItemId: (nextItem || {id: null}).id,
      previousItemId: (previousItem || {id: null}).id
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

export default connect(mapStateToProps, mapDispatchToProps)(ItemDialogButtons);
