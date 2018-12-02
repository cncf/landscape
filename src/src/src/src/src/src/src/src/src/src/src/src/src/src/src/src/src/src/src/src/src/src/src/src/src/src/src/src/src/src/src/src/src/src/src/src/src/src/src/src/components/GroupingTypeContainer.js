import { connect } from 'react-redux';
import ComboboxSelector from './ComboboxSelector';
import { changeGrouping } from '../reducers/mainReducer.js';
import fields from '../types/fields';

const groupingFields = ['landscape', 'cncfRelation', 'license', 'organization', 'headquarters'];
const options = [{
  id: 'no',
  label: 'No Grouping',
  url: 'no'
}].concat(groupingFields.map(function(x) {
  return  {
    id: x,
    label: fields[x].groupingLabel
  };
}).filter(function(x) {
  return ! fields[x.id].hideInGrouping;
}));

const mapStateToProps = (state) => ({
  value: state.main.grouping,
  options: options
});
const onChange = function(newValue) {
  return changeGrouping(newValue);
}
const mapDispatchToProps = {
  onChange: onChange
};

export default connect(mapStateToProps, mapDispatchToProps)(ComboboxSelector);
