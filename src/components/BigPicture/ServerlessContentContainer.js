import { connect } from 'react-redux';
import ServerlessContent from './ServerlessContent';
import { changeSelectedItemId} from '../../reducers/mainReducer';
import { getGroupedItemsForServerlessBigPicture } from '../../utils/itemsCalculator';


const mapStateToProps = (state) => ({
  groupedItems: getGroupedItemsForServerlessBigPicture(state)
});
const mapDispatchToProps = {
  onSelectItem: changeSelectedItemId
};

export default connect(mapStateToProps, mapDispatchToProps)(ServerlessContent);
