import { connect } from 'react-redux';
import MainContent2 from './MainContent2';
import { changeSelectedItemId} from '../reducers/mainReducer';
import { getGroupedItemsForBigPicture } from '../utils/itemsCalculator';


const mapStateToProps = (state) => ({
  groupedItems: getGroupedItemsForBigPicture(state)
});
const mapDispatchToProps = {
  onSelectItem: changeSelectedItemId
};

export default connect(mapStateToProps, mapDispatchToProps)(MainContent2);
