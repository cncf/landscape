import { connect } from 'react-redux';
import MainContent2 from './MainContent2';
import { openSelectedItemIdInNewTab, changeSelectedItemId} from '../reducers/mainReducer';
import getGroupedItems from '../utils/itemsCalculator';


const mapStateToProps = (state) => ({
  groupedItems: getGroupedItems(state)
});
const mapDispatchToProps = {
  onSelectItem: changeSelectedItemId,
  onOpenItemInNewTab: openSelectedItemIdInNewTab
};

export default connect(mapStateToProps, mapDispatchToProps)(MainContent2);
