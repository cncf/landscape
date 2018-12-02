import { connect } from 'react-redux';
import SwitchButton from './SwitchButton';
import { changeMainContentMode } from '../../reducers/mainReducer.js';
import { filtersToUrl } from '../../utils/syncToUrl';


const mapStateToProps = (state) => ({
  mainContentMode: state.main.mainContentMode,
  cardUrl: filtersToUrl({filters: state.main.filters, grouping: state.main.grouping, sortField: state.main.sortField, mainContentMode: 'card'}),
  landscapeUrl: filtersToUrl({filters: state.main.filters, grouping: state.main.grouping, sortField: state.main.sortField, mainContentMode: 'landscape'}),
  serverlessUrl: filtersToUrl({filters: state.main.filters, grouping: state.main.grouping, sortField: state.main.sortField, mainContentMode: 'serverless'}),
});
const mapDispatchToProps = {
  changeMainContentMode: changeMainContentMode
};

export default connect(mapStateToProps, mapDispatchToProps)(SwitchButton);
