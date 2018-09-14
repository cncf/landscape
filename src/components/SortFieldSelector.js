import React from 'react';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import ComboboxSelector from './ComboboxSelector';


const SortFieldSelector = ({isBigPicture, value, options, onChange}) => {
  if (!isBigPicture) {
    return <ComboboxSelector value={value} options={options} onChange={onChange} />;
  } else {
    return (
      <Select
        disabled
        value="empty"
        style={{width:175 ,fontSize:'0.8em'}}
      >
        <MenuItem value="empty">
          <em>N/A</em>
        </MenuItem>
      </Select>
    );
  }
};
export default SortFieldSelector;
