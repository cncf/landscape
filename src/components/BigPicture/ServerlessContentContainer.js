import { connect } from 'react-redux';
import ServerlessContent from './ServerlessContent';
import { changeSelectedItemId, changeMainContentMode } from '../../reducers/mainReducer';
import { getGroupedItemsForServerlessBigPicture } from '../../utils/itemsCalculator';


const mapStateToProps = (state) => ({
  groupedItems: getGroupedItemsForServerlessBigPicture(state),
  zoom: state.main.zoom,
  showPreview: true
});
const mapDispatchToProps = {
  onSelectItem: changeSelectedItemId,
  switchToLandscape: () => changeMainContentMode('landscape')
};

export default connect(mapStateToProps, mapDispatchToProps)(ServerlessContent);
