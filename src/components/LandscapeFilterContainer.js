import { connect } from 'react-redux';
import TreeSelector from './TreeSelector';
import { changeFilter } from '../reducers/mainReducer.js';
import { options } from '../types/fields';

const mapStateToProps = (state) => ({
  value: state.main.filters.landscape,
  options: options('landscape')
});
const onChange = function(newValue) {
  return changeFilter('landscape', newValue);
}
const mapDispatchToProps = {
  onChange: onChange
};

export default connect(mapStateToProps, mapDispatchToProps)(TreeSelector);
