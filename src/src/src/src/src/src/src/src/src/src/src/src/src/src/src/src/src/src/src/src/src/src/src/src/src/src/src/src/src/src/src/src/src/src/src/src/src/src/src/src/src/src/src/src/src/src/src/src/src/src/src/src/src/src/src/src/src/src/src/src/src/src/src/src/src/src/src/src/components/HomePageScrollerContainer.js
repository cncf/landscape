import { connect } from 'react-redux';
import getGroupedItems from '../utils/itemsCalculator';

const mapStateToProps = (state) => ({
  groupedItems: getGroupedItems(state)
});
const mapDispatchToProps = {
};

const Component = function() {
  setTimeout(function() {
    document.scrollingElement.scrollTop = 0;
  }, 1);
  return null;
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
