import { connect } from 'react-redux';
import MainContent from './MainContent';
import { changeSelectedItemId} from '../reducers/mainReducer';
import getGroupedItems from '../utils/itemsCalculator';

const mapStateToProps = (state) => ({
  groupedItems: getGroupedItems(state)
});
const mapDispatchToProps = {
  onSelectItem: changeSelectedItemId
};

export default connect(mapStateToProps, mapDispatchToProps)(MainContent);
