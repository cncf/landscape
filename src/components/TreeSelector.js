import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import _ from 'lodash';


const TreeSelector = ({value, options, onChange}) => {
  const renderValue = function(selected) {
    if (selected.length === 0) {
      return 'Any';
    }
    return selected.map((x) => _.find(options, {id: x}).label).join(', ');
  }
  const onItemChanged = function(newSelection) {
    // we have new list of checked items(newSelection and previous list of
    // checked items(value), we want to get a single item which was checked /
    // unchecked
    var itemId = _.difference(newSelection, value).concat(_.difference(value, newSelection))[0];
    var newValue;
    const option = _.find(options, {id: itemId});
    const withoutCategory = function() {
      return value.filter(function(v) {
        return v !== option.id && option.children.indexOf(v) === -1;
      });
    }
    const checkedCategory = function() {
      return options.filter(function(o) {
        return o.id === option.id || option.children.indexOf(o.id) !== -1;
      }).map(function(o) { return o.id});
    }
    if (option.level === 1) {
      if (value.indexOf(option.id) !== -1) {
        //uncheck category
        newValue = withoutCategory();
      } else {
        //check category
        newValue = withoutCategory().concat(checkedCategory());
      }
    } else if (option.level === 2) {
      if (value.indexOf(option.id) !== -1) {
        //uncheck subcategory, may be whole category
        newValue = value.filter(function(x) {
          return x !== option.id;
        });
        let parentCategory = _.find(options, {id: option.parentId});
        if (_.every(parentCategory.children, function(childId) {
          return newValue.indexOf(childId) === -1;
        })) {
          newValue = newValue.filter(function(x) {
            return x !== parentCategory.id;
          });
        }
      } else {
        //check subcategory, may be whole category
        newValue = value.concat([option.id]);
        let parentCategory = _.find(options, {id: option.parentId});
        if (_.every(parentCategory.children, function(childId) {
          return newValue.indexOf(childId) !== -1;
        })) {
          newValue = newValue.concat([parentCategory.id]);
        }
      }
    }
    newValue = options.filter(function(o) {
      return newValue.indexOf(o.id) !== -1;
    }).map(function(o) {
      return o.id;
    });
    onChange(newValue);
  };

  return <Select
    multiple
    style={{width:175 ,fontSize:'0.8em'}}
    value={value}
    renderValue={renderValue }
    onChange={(e) => onItemChanged(e.target.value)}
    displayEmpty
  >
    { options.map( (el) => (
      <MenuItem  key={el.id}
                 value={el.id}
                 style={{height:5}}>
        <span  style={{width: (el.level - 1) * 20 }}/>
        <Checkbox color="primary" disableRipple checked={value.indexOf(el.id) !== -1} />
        <ListItemText disableTypography primary={el.label} style={{fontSize:'0.8em', padding:0}} />
      </MenuItem>
    )) }
  </Select>
};
export default TreeSelector;
