import createSelector from '../utils/createSelector';
import _ from 'lodash';
import fields, { filterFn, getGroupingValue } from '../types/fields';
import groupingLabel from '../utils/groupingLabel';
import groupingOrder from '../utils/groupingOrder';
import formatAmount from '../utils/formatAmount';
import formatNumber from 'format-number';
import { filtersToUrl } from '../utils/syncToUrl';
import stringOrSpecial from '../utils/stringOrSpecial';
const landscape = fields.landscape.values;

export const getFilteredItems = createSelector(
  [(state) => state.main.data,
  (state) => state.main.filters
  ],
  function(data, filters) {
    var filterCncfHostedProject = function(x) {
      const oldValue = filterFn({field: 'cncfRelation', filters})(x);
      if (filters.cncfRelation.indexOf('sandbox') !== -1) {
        return oldValue || x.cncfProject === 'sandbox';
      } else {
        return oldValue;
      }
    }
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

const addExtraFields = function(data) {
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

const getFilteredItemsForBigPicture = createSelector(
  [(state) => state.main.data,
  (state) => state.main.filters
  ],
  function(data, filters) {
    var filterCncfHostedProject = function(x) {
      const oldValue = filterFn({field: 'cncfRelation', filters})(x);
      if (filters.cncfRelation.indexOf('sandbox') !== -1) {
        return oldValue || x.cncfProject === 'sandbox';
      } else {
        return oldValue;
      }
    }
    var filterByLicense = filterFn({field: 'license', filters});
    var filterByOrganization = filterFn({field: 'organization', filters});
    var filterByHeadquarters = filterFn({field: 'headquarters', filters});
    var filterByBestPractices = filterFn({field: 'bestPracticeBadgeId', filters});
    return addExtraFields(data.filter(function(x) {
      return filterCncfHostedProject(x) && filterByLicense(x) && filterByOrganization(x) && filterByHeadquarters(x) && filterByBestPractices(x);
    }));
  }
);

const getExtraFields = createSelector(
  [ getFilteredItems ], addExtraFields
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

    let grouped = _.groupBy(items, function(item) {
      return getGroupingValue({item: item, grouping: grouping});
    });

    if (grouping === 'cncfRelation' && filters.cncfRelation.indexOf('sandbox') !== -1) {
      grouped = _.groupBy(items, function(item) {
        const oldValue = getGroupingValue({item: item, grouping: grouping});
        if (item.cncfProject === 'sandbox') {
          return 'sandbox'
        } else {
          return oldValue;
        }
      });
    }


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

const bigPictureSortOrder = [
  function orderByProjectKind(item) {
    const result = {
      "graduated": 1,
      "incubating": 2,
      "sandbox" : 99
    }[item.cncfProject] || 99;
    return result;
  },
  function orderByProjectName(item) {
    return item.name.toLowerCase();
  }
];

export const getGroupedItemsForBigPicture = createSelector(
  [ getFilteredItemsForBigPicture,
    (state) => state.main.data,
    (state) => state.main.grouping,
    (state) => state.main.filters,
    (state) => state.main.sortField
  ],
  function(items, allItems, grouping, filters, sortField) {
    const categories = landscape.filter( (l) => l.level === 1).map(function(category) {
      const newFilters = {...filters, landscape: category.id };
      return {
        key: stringOrSpecial(category.label),
        header: category.label,
        href: filtersToUrl({filters: newFilters, grouping: 'landscape', sortField, mainContentMode: 'card'}),
        subcategories: landscape.filter( (l) => l.parentId === category.id).map(function(subcategory) {
          const newFilters = {...filters, landscape: subcategory.id };
          return {
            name: subcategory.label,
            href: filtersToUrl({filters: newFilters, grouping: 'landscape', sortField, mainContentMode: 'card'}),
            items: _.orderBy(items.filter(function(item) {
              return item.landscape ===  subcategory.id
            }), bigPictureSortOrder),
            allItems: _.orderBy(allItems.filter(function(item) {
              return item.landscape ===  subcategory.id
            }), bigPictureSortOrder)
          };
        })
      };
    });
    return categories;
  }
);


export const getGroupedItemsForServerlessBigPicture = createSelector([
     getFilteredItemsForBigPicture,
    (state) => state.main.data,
    (state) => state.main.grouping,
    (state) => state.main.filters,
    (state) => state.main.sortField
  ],
  function(items, allItems, grouping, filters, sortField) {
    const serverlessCategory = landscape.filter( (l) => l.label === 'Serverless')[0];
    const hostedPlatformSubcategory = _.find(landscape, {label: 'Hosted Platform'});
    const installablePlatformSubcategory = _.find(landscape, {label: 'Installable Platform'});

    const subcategories = landscape.filter( (l) => l.parentId === serverlessCategory.id);

    const itemsFrom = function(subcategoryId) {
      return _.orderBy(items.filter(function(item) {
              return item.landscape ===  subcategoryId
            }), bigPictureSortOrder)
    };

    const allItemsFrom = function(subcategoryId) {
      return _.orderBy(allItems.filter(function(item) {
              return item.landscape ===  subcategoryId
            }), bigPictureSortOrder)
    };

    const result = subcategories.map(function(subcategory) {
      const newFilters = {...filters, landscape: subcategory.id };
      return {
        key: stringOrSpecial(subcategory.label),
        header: subcategory.label,
        href: filtersToUrl({filters: newFilters, grouping: 'landscape', sortField, mainContentMode: 'card'}),
        subcategories: [
          {
            name: '',
            href: '',
            items: itemsFrom(subcategory.id),
            allItems: allItemsFrom(subcategory.id)
          }
        ]
      };
    });

    // merge platforms
    const merged = {
      key: stringOrSpecial('Platform'),
      header: 'Platform',
      href: filtersToUrl({
        filters: {...filters,  landscape: [hostedPlatformSubcategory.id, installablePlatformSubcategory.id]},
        grouping: 'landscape', sortField, mainContentMode: 'card'
      }),
      subcategories: [
        {
          name: 'Hosted',
          href: filtersToUrl({
            filters: {...filters, landscape: hostedPlatformSubcategory.id},
            grouping: 'landscape', sortField, mainContentMode: 'card'
          }),
          items: itemsFrom(hostedPlatformSubcategory.id),
          allItems: allItemsFrom(hostedPlatformSubcategory.id)
        },
        {
          name: 'Installable',
          href: filtersToUrl({
            filters: {...filters, landscape: installablePlatformSubcategory.id},
            grouping: 'landscape', sortField, mainContentMode: 'card'
          }),
          items: itemsFrom(installablePlatformSubcategory.id),
          allItems: allItemsFrom(installablePlatformSubcategory.id)
        }
      ]
    };

    return result.filter(function(x) { return x.header !== 'Hosted Platform'}).filter(function(x) { return x.header !== 'Installable Platform'}).concat([merged]);


  }
);

export default getGroupedItems;
