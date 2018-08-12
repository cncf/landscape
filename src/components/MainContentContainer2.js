import { connect } from 'react-redux';
import MainContent2 from './MainContent2';
import { openSelectedItemIdInNewTab, changeSelectedItemId} from '../reducers/mainReducer';
import { getGroupedItemsForBigPicture } from '../utils/itemsCalculator';


const mapStateToProps = (state) => ({
  groupedItems: getGroupedItemsForBigPicture(state)
});
const mapDispatchToProps = {
  onSelectItem: changeSelectedItemId,
  onOpenItemInNewTab: openSelectedItemIdInNewTab
};

export default connect(mapStateToProps, mapDispatchToProps)(MainContent2);
