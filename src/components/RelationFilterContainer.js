import { connect } from 'react-redux';
import TreeSelector from './TreeSelector';
import { changeFilter } from '../reducers/mainReducer';
import { options } from '../types/fields';

const mapStateToProps = (state) => ({
  value: state.main.filters.lfdlRelation,
  options: options('lfdlRelation')
});
const onChange = function(newValue) {
  return changeFilter('lfdlRelation', newValue);
}
const mapDispatchToProps = {
  onChange: onChange
};

export default connect(mapStateToProps, mapDispatchToProps)(TreeSelector);
