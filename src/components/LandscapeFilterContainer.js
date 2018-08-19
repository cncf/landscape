import { connect } from 'react-redux';
import LandscapeSelector from './LandscapeSelector';
import { changeFilter } from '../reducers/mainReducer.js';
import { options } from '../types/fields';

const mapStateToProps = (state) => ({
  isBigPicture: state.main.isBigPicture,
  value: state.main.filters.landscape,
  options: options('landscape')
});
const onChange = function(newValue) {
  return changeFilter('landscape', newValue);
}
const mapDispatchToProps = {
  onChange: onChange
};

export default connect(mapStateToProps, mapDispatchToProps)(LandscapeSelector);
