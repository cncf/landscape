import { connect } from 'react-redux';
import HomePage from './HomePage';
import {showFilters, hideFilters, closeDialog } from '../reducers/mainReducer';
import isEmbed from '../utils/isEmbed';

const mapStateToProps = (state) => ({
  ready: state.main.ready,
  filtersVisible: state.main.filtersVisible && !isEmbed,
  isEmbed: isEmbed,
  isBigPicture: state.main.isBigPicture,
  hasSelectedItem: !!state.main.selectedItemId
});
const mapDispatchToProps = {
  showFilters: showFilters,
  hideFilters: hideFilters,
  onClose: closeDialog
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
