import { connect } from 'react-redux';
import MainContent2 from './MainContent2';
import { changeSelectedItemId, changeMainContentMode } from '../../reducers/mainReducer';
import { getGroupedItemsForBigPicture } from '../../utils/itemsCalculator';


const mapStateToProps = (state) => ({
  groupedItems: getGroupedItemsForBigPicture(state),
  zoom: state.main.zoom,
  showPreview: true
});
const mapDispatchToProps = {
  onSelectItem: changeSelectedItemId,
  switchToServerless: () => changeMainContentMode('serverless')
};

export default connect(mapStateToProps, mapDispatchToProps)(MainContent2);
