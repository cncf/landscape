import createSelector from '../utils/createSelector';
import _ from 'lodash';
import { getFilteredItems } from './itemsCalculator';

const getOrganizations = createSelector(
  [ getFilteredItems ],
  function(filteredItems) {
    const result = {};
    _.each(filteredItems, function(item) {
      if (!result[item.organization]) {
        result[item.organization] = {
          name: item.organization,
          funding: item.amountKind === 'funding' ? item.amount : 0,
          marketCap: item.amountKind === 'market_cap' ? item.amount : 0
        }
      }
    });
    return _.values(result);
  }
);

const getSummary = createSelector(
  [ getFilteredItems, getOrganizations],
  function(filteredItems, organizations) {
    const total = filteredItems.length;
    const stars = _.sum(_.map(filteredItems, (x) => x.stars  || 0));
    const funding = _.sumBy(organizations, 'funding');
    const marketCap = _.sumBy(organizations, 'marketCap');
    return { total, stars, funding, marketCap };
  }
);
export default getSummary;
