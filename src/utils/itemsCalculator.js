import createSelector from '../utils/createSelector';
import _ from 'lodash';
import fields, { filterFn, getGroupingValue } from '../types/fields';
import groupingLabel from '../utils/groupingLabel';
import groupingOrder from '../utils/groupingOrder';
import formatAmount from '../utils/formatAmount';
import formatNumber from 'format-number';
import { filtersToUrl } from '../utils/syncToUrl';
import stringOrSpecial from '../utils/stringOrSpecial';
import lookup from '../lookup.json';

export const getFilteredItems = createSelector(
  [(state) => state.main.data,
  (state) => state.main.filters
  ],
  function(data, filters) {
    var filterCncfHostedProject = filterFn({field: 'cncfRelation', filters});
    var filterByLicense = filterFn({field: 'license', filters});
    var filterByOrganization = filterFn({field: 'organization', filters});
    var filterByHeadquarters = filterFn({field: 'headquarters', filters});
    var filterByLandscape = filterFn({field: 'landscape', filters});
    var filterByBestPractices = filterFn({field: 'bestPracticeBadgeId', filters});
    return data.filter(function(x) {
      return filterCncfHostedProject(x) && filterByLicense(x) && filterByOrganization(x) && filterByHeadquarters(x) && filterByLandscape(x) && filterByBestPractices(x);
    });
  }
);

const getFilteredItemsForBigPicture = createSelector(
  [(state) => state.main.data,
  (state) => state.main.filters
  ],
  function(data, filters) {
    var filterCncfHostedProject = filterFn({field: 'cncfRelation', filters});
    var filterByLicense = filterFn({field: 'license', filters});
    var filterByOrganization = filterFn({field: 'organization', filters});
    var filterByHeadquarters = filterFn({field: 'headquarters', filters});
    var filterByBestPractices = filterFn({field: 'bestPracticeBadgeId', filters});
    return data.filter(function(x) {
      return filterCncfHostedProject(x) && filterByLicense(x) && filterByOrganization(x) && filterByHeadquarters(x) && filterByBestPractices(x);
    });
  }
);

const getExtraFields = createSelector(
  [ getFilteredItems ],
  function(data) {
    return _.map(data, function(data) {
      const hasStars = data.stars !== 'N/A' && data.stars !== 'Not Entered Yet';
      const hasMarketCap = data.amount !== 'N/A' && data.amount !== 'Not Entered Yet';
      return { ...data,
        starsPresent: hasStars ,
        starsAsText: hasStars ? formatNumber({integerSeparator: ','})(data.stars) : '',
        marketCapPresent: hasMarketCap,
        marketCapAsText: formatAmount(data.amount)
      };
    });
  }
);

const getSortedItems = createSelector(
  [
  getExtraFields,
  (state) => state.main.sortField,
  (state) => state.main.sortDirection
  ],
  function(data, sortField, sortDirection) {
    const fieldInfo = fields[sortField];
    const emptyItemsNA = data.filter(function(x) {
      return x[sortField] === 'N/A';
    });
    const emptyItemsNotEnteredYet = data.filter(function(x) {
      return x[sortField] === 'Not Entered Yet';
    });
    const emptyItemsUndefined = data.filter(function(x) {
      return _.isUndefined(x[sortField]);
    });
    const normalItems = data.filter(function(x) {
      return x[sortField] !== 'N/A' && x[sortField] !== 'Not Entered Yet' && !_.isUndefined(x[sortField]);
    });
    const sortedViaMainSort =  _.orderBy(normalItems, [function(x) {
      var result = x[sortField];
      if (fieldInfo && fieldInfo.orderFn) {
        result = fieldInfo.orderFn(result);
      }
      if (_.isString(result)) {
        result = result.toLowerCase();
      }
      return result;
    }, (x) => x.name.toLowerCase()],[sortDirection, 'asc']);
    const sortedViaName1 = _.orderBy(emptyItemsNA, function(x) {
      return x.name.toLowerCase();
    });
    const sortedViaName2 = _.orderBy(emptyItemsNotEnteredYet, function(x) {
      return x.name.toLowerCase();
    });
    const sortedViaName3 = _.orderBy(emptyItemsUndefined, function(x) {
      return x.name.toLowerCase();
    });
    return sortedViaMainSort.concat(sortedViaName1).concat(sortedViaName2).concat(sortedViaName3);
  }
);

const getGroupedItems = createSelector(
  [
  getSortedItems,
  (state) => state.main.grouping,
  (state) => state.main.filters,
  (state) => state.main.sortField
  ],
  function(items, grouping, filters, sortField) {
    if (grouping === 'no') {
      return [{
        key: 'key',
        header: 'No Grouping',
        items: items
      }]
    }

    const grouped = _.groupBy(items, function(item) {
      return getGroupingValue({item: item, grouping: grouping});
    });
    const fieldInfo = fields[grouping];
    return _.orderBy(_.map(grouped, function(value, key) {
      const properKey = stringOrSpecial(key);
      const newFilters = {...filters, [grouping]: fieldInfo.isArray ? [properKey] : properKey};
      return {
        key: properKey,
        header: groupingLabel(grouping, properKey),
        items: value,
        href: filtersToUrl({filters: newFilters, grouping, sortField})
      }
    }), (group) => groupingOrder(grouping)(group.key));
  }
);

export const getGroupedItemsForBigPicture = createSelector(
  [ getFilteredItemsForBigPicture,
    (state) => state.main.grouping,
    (state) => state.main.filters,
    (state) => state.main.sortField
  ],
  function(items, grouping, filters, sortField) {
    const categories = lookup.landscape.filter( (l) => l.level === 1).map(function(category) {
      const newFilters = {...filters, landscape: category.id };
      return {
        key: stringOrSpecial(category.label),
        header: category.label,
        href: filtersToUrl({filters: newFilters, grouping, sortField, isBigPicture: false}),
        subcategories: lookup.landscape.filter( (l) => l.parentId === category.id).map(function(subcategory) {
          const newFilters = {...filters, landscape: subcategory.id };
          return {
            name: subcategory.label,
            href: filtersToUrl({filters: newFilters, grouping, sortField, isBigPicture: false}),
            items: _.orderBy(items.filter(function(item) {
              return item.landscape ===  subcategory.id
            }), [function orderFn(item) {
              return !item.cncfProject;
            }, 'name'])
          };
        })
      };
    });
    return categories;
  }
);

export default getGroupedItems;
