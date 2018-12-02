import fields from '../types/fields';
import _ from 'lodash';
export default function groupFn(field) {
  const values = fields[field].answers;
  const sortedValues = _.orderBy(values, 'groupingSortOrder');
  return function(x) {
    return _.findIndex(sortedValues, {id: x});
  }
}
