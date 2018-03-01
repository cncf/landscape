import { connect } from 'react-redux';
import ComboboxMultiSelector from './ComboboxMultiSelector';
import { changeFilter } from '../reducers/mainReducer.js';
import { options } from '../types/fields';

const mapStateToProps = (state) => ({
  value: state.main.filters.vcFunder,
  options: options('vcFunder')
});
const onChange = function(newValue) {
  return changeFilter('vcFunder', newValue);
}
const mapDispatchToProps = {
  onChange: onChange
};

export default connect(mapStateToProps, mapDispatchToProps)(ComboboxMultiSelector);
