import fields from '../types/fields';
import _ from 'lodash';
export default function(field, id) {
  const values = fields[field].answers;
  const valueInfo = _.find(values, {id: id});
  return valueInfo.groupingLabel;
}
