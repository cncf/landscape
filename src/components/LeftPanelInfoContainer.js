import { connect } from 'react-redux';
import LeftPanelInfo from './LeftPanelInfo';

const mapStateToProps = (state) => ({
  values: {
    filters: state.main.filters,
    grouping: state.main.grouping,
    sortField: state.main.sortField,
    sortDirection: state.main.sortDirection
  }
});
const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(LeftPanelInfo);
