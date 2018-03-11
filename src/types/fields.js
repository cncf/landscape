// struture:
// url: a name how the field appears in the url
// label: a header to the field in a select header
// category :
// groupingLabel(label by default): a name of the field in the grouping selector
// values: a list of possible values, strucutre:
//     id: value id for the select field
//     label: text in the select combo
//     groupingLabel(label by default): text in the grouping header
//     url(id by default): how the value is stored in the url
//     sortOrder(element index by default): sort order when grouping
//     match: function
import _ from 'lodash';
import lookups from '../lookup.json';
const fields = {
  cncfRelation: {
    id: 'cncfRelation',
    url: 'cncf',
    label: 'CNCF Relation',
    isArray: true,
    values: [{
      id: 'hosted',
      label: 'CNCF Projects',
      url: 'hosted',
      level: 1,
      children: ['graduated', 'incubating', 'sandbox']
    }, {
      id: 'graduated',
      label: 'Graduated CNCF Projects',
      tag: 'Graduated',
      url: 'graduated',
      level: 2,
      parentId: 'hosted'
    }, {
      id: 'incubating',
      label: 'Incubating CNCF Projects',
      tag: 'Incubating',
      url: 'incubating',
      level: 2,
      parentId: 'hosted'
    }, {
      id: 'sandbox',
      label: 'Sandbox CNCF Projects',
      tag: 'Sandbox',
      url: 'sandbox',
      level: 2,
      parentId: 'hosted'
    }, {
      id: 'member',
      label: 'CNCF Member Products/Projects',
      tag: 'CNCF Member',
      url: 'member',
      level: 1,
      children: []
    }, {
      id: false,
      label: 'Non-CNCF Member Products/Projects',
      url: 'no',
      level: 1,
      children: []
    }]
  },
  stars: {
    id: 'stars',
    label: 'Stars',
    category: 'starsCategory',
    values: [{
      id: null,
      label: 'Any',
      url: 'any'
    }, {
      id: 'N/A',
      label: 'N/A',
      url:'n-a',
      match: function(x) {
        return x === 'N/A';
      }
    }, {
      id: '1to100',
      label:'1-100',
      match: function(x) {
        return x < 100;
      }
    }, {
      id: '100to1000',
      label:'100-1000',
      match: function(x) {
        return 100 <= x && x < 1000;
      }
    }, {
      id: '1000to10000',
      label:'1000-10000',
      match: function(x) {
        return 1000 <= x && x < 10000;
      }
    }, {
      id: 'over10000',
      label: '10000+',
      match: function(x) {
        return 10000 <= x;
      }
    }]
  },
  // certifiedKubernetes: {
    // id: 'certifiedKubernetes',
    // url: 'kubernetes',
    // label: '(fake) Certified Kubernetes',
    // filterFn: function(filterValue, itemValue) {
      // if (filterValue === null) {
        // return true;
      // }
      // if (filterValue === 'platform') {
        // return itemValue === 'platform'
      // }
      // if (filterValue === 'distribution') {
        // return itemValue === 'distribution';
      // }
      // if (filterValue === 'platformOrDistribution') {
        // return itemValue === 'platform' || itemValue === 'distribution';
      // }
      // if (filterValue === 'notCertified') {
        // return itemValue === false;
      // }
      // if (filterValue === 'all') {
        // return itemValue === 'platform' || itemValue === 'distribution' || itemValue === false;
      // }
      // console.info('oops, strange filter value: ', filterValue);
    // },
    // values: [{
      // id: null,
      // label: 'Any',
      // url: 'any'
    // }, {
      // id: 'platform',
      // label: 'Platform',
    // }, {
      // id: 'distribution',
      // label: 'Distribution',
    // }, {
      // id: 'platformOrDistribution',
      // label: 'Platform Or Distribution',
    // }, {
      // id: 'notCertified',
      // label: 'Not Certified',
    // }, {
      // id: 'all',
      // label: 'All Kubernetes Products'
    // }],
    // answers: [{
      // id: null,
      // groupingLabel: 'Not Related'
    // }, {
      // id: 'platform',
      // groupingLabel: 'Platform'
    // }, {
      // id: 'distribution',
      // groupingLabel: 'Distribution'
    // }, {
      // id: false,
      // groupingLabel: 'Not Certified'
    // }]
  // },
  license: {
    id: 'license',
    label: 'License',
    isArray: true,
    values: [].concat(lookups.license || []),
    processValuesBeforeSaving: function(values) {
      return processValuesBeforeSaving({options: fields.license.values, values: values});
    },
    processValuesBeforeLoading: function(values) {
      return processValuesBeforeLoading({options: fields.license.values, values: values});
    }
  },
  amount: {
    id: 'amount',
    label: 'Market Cap / Funding of organization',
    values: [{
      id: null,
      label: 'Any',
      url: 'any'
    }, {
      id: 'Not Entered Yet',
      label: 'Not Entered Yet',
      url:'not-entered-yet',
      match: function(x) {
        return x === 'Not Entered Yet';
      }
    }, {
      id: 'N/A',
      label: 'N/A',
      url:'n-a',
      match: function(x) {
        return x === 'N/A';
      }
    }, {
      id: 'below1m',
      label: '<1M',
      match: function(x) {
        return x < 1 * 1000 * 1000;
      }
    }, {
      id: '1mto10m',
      label: '1M-10M',
      match: function(x) {
        return 1 * 1000 * 1000 <= x && x < 10 * 1000 * 1000 ;
      }
    }, {
      id: '10mto100m',
      label: '10M-100M',
      match: function(x) {
        return 10 * 1000 * 1000 <= x && x < 100 * 1000 * 1000;
      }
    }, {
      id: '100mto1000m',
      label: '100M-1000M',
      match: function(x) {
        return 100 * 1000 * 1000 <= x && x < 1000 * 1000 * 1000;
      }
    }, {
      id: 'over1000m',
      label: '1000M+',
      match: function(x) {
        return 1000 * 1000 * 1000 <= x;
      }
    }]
  },
  // vcFunder: {
    // id: 'vcFunder',
    // isArray: true,
    // label: '(fake) VC Funders',
    // values: [].concat(lookups.vcFunder || [])
  // },
  organization: {
    id: 'organization',
    label: 'Organization',
    isArray: true,
    values: [].concat(lookups.organization || [])
  },
  headquarters: {
    id: 'headquarters',
    label: 'Headquarters Location',
    isArray: true,
    values: [].concat(_.orderBy(lookups.headquarters, function(x) {
      if  (x.id === 'N/A') {
        return -1;
      }
      return lookups.headquarters.indexOf(x);
    })|| [])
  },
  landscape: {
    id: 'landscape',
    label: 'Category',
    isArray: true,
    values: [].concat(lookups.landscape || []),
    processValuesBeforeSaving: function(values) {
      return processValuesBeforeSaving({options: fields.landscape.values, values: values});
    },
    processValuesBeforeLoading: function(values) {
      return processValuesBeforeLoading({options: fields.landscape.values, values: values});
    }
  },
  firstCommitDate: {
    id: 'firstCommitDate',
    label: 'Project Starting Date',
    url: 'first-commit',
    hideInGrouping: true
  },
  latestCommitDate: {
    id: 'latestCommitDate',
    label: 'Project Latest Date',
    url: 'latest-commit',
    hideInGrouping: true
  },
  contributorsCount: {
    id: 'contributorsCount',
    label: 'Contributors #',
    url: 'contributors',
    hideInGrouping: true
  }
};
_.each(fields, function(field, key) {
  field.id = key;
  _.defaults(field, {
    groupingLabel: field.label,
    url: field.id,
    answers: field.values,
    processValuesBeforeSaving: _.identity,
    processValuesBeforeLoading: _.identity
  });
  _.each(field.values, function(value, index) {
    _.defaults(value, {
      groupingLabel: value.label,
      url: value.id,
      groupingSortOrder: index
    });
  });
  _.each(field.answers, function(value, index) {
    _.defaults(value, {
      groupingSortOrder: index
    });
  });
});
export default fields;

const processValuesBeforeLoading = function({options, values}) {
  return options.filter(function(option) {
    if (option.children) {
      return !_.every(option.children, function(childOptionId) {
        return values.indexOf(childOptionId) === -1
      }) || values.indexOf(option.id) !== -1;
    }
    const parentOption = _.find(options, {id: option.parentId});
    return values.indexOf(parentOption.id) !== -1 || values.indexOf(option.id) !== -1;
  }).map( (option) => option.id);
};

const processValuesBeforeSaving = function({options, values}) {
  return values.filter(function(value) {
    const option = _.find(options, {id: value});
    // keep parent only if all children are checked
    if (option.children) {
      return _.every(option.children, function(childOptionId) {
        return values.indexOf(childOptionId) !== -1;
      });
    }
    // keep child only if any of childrens is not checked
    const parentOption = _.find(options, {id: option.parentId});
    return ! _.every(parentOption.children, function(childOptionId) {
      return values.indexOf(childOptionId) !== -1;
    });
  });
};

export function options(field) {
  return fields[field].values.map(function(values) {
    return {
      id: values.id,
      label: values.label,
      level: values.level,
      children: values.children,
      parentId: values.parentId
    };
  });
}
export function filterFn({field, filters}) {
  const fieldInfo = fields[field];
  const filter = filters[field];
  return function(x) {
    // can be null, id, [] or [id1, id2, id3 ]
    const value = fieldInfo.category ? x[fieldInfo.category] : x[field];
    if (fieldInfo.filterFn) {
      return fieldInfo.filterFn(filter, value, x);
    }
    if (filter === null) {
      return true;
    }
    if (filter.length === 0) {
      return true;
    }
    if (_.isArray(filter)) {
      return filter.indexOf(value) !== -1;
    } else {
      return value === filter;
    }
  };
}
export function getGroupingValue({item, grouping}) {
  const fieldInfo = fields[grouping];
  const value = fieldInfo.category ? item[fieldInfo.category] : item[fieldInfo.id];
  return value;
}
export function getCategory({field, item }) {
  const fieldInfo = fields[field];
  const value = item[field];
  const categoryEntry = _.find(fieldInfo.values, function(valueInfo) {
    return valueInfo.match && valueInfo.match(value);
  })
  if (!categoryEntry.id) {
    console.info('error! can not find category for the ' , field, ' with value: ', value);
    return 'N/A';
  }
  const category = categoryEntry.id;
  return category;
}
export function sample(field) {
  return _.sample(fields[field].values.map(function(x) {
    return x.id;
  }).filter(function(x) { return !!x; }));
}
