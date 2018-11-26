import { connect } from 'react-redux';
import createSelector from '../utils/createSelector';
import HomePage from './HomePage';
import {showFilters, hideFilters, closeDialog } from '../reducers/mainReducer';
import isEmbed from '../utils/isEmbed';

import getGroupedItems, {getGroupedItemsForBigPicture } from '../utils/itemsCalculator';
import selectedItemCalculator from '../utils/selectedItemCalculator';

const defaultTitle =  `LFDL Interactive Landscape`;
const getTitle = createSelector([state => state], function(state) {
    if (!state.main.ready) {
      return defaultTitle;
    }
    const groupedItems = getGroupedItems(state);
    const groupedItemsForBigPicture = getGroupedItemsForBigPicture(state);
    const selectedItemId = state.main.selectedItemId;
    const isBigPicture = state.main.mainContentMode !== 'card';
    const selectedItemInfo = selectedItemCalculator(groupedItems, groupedItemsForBigPicture, selectedItemId, isBigPicture);
    return selectedItemInfo.hasSelectedItem ? `${selectedItemInfo.itemInfo.name} - ${defaultTitle}` : defaultTitle;
});

const mapStateToProps = (state) => ({
  ready: state.main.ready,
  filtersVisible: state.main.filtersVisible && !isEmbed,
  isEmbed: isEmbed,
  isFullscreen: state.main.isFullscreen && state.main.mainContentMode !== 'card',
  mainContentMode: state.main.mainContentMode,
  hasSelectedItem: !!state.main.selectedItemId,
  title: getTitle(state)
});
const mapDispatchToProps = {
  showFilters: showFilters,
  hideFilters: hideFilters,
  onClose: closeDialog
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
