import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const CheckboxSelector = ({value, options, onChange}) => {
  const valueOf = function(checkbox) {
    return value.indexOf(checkbox) !== -1;
  };
  const handleCheckboxChange = function(checkbox, checked) {
    console.info(checkbox, checked);
    if (checked) {
      onChange(value.concat([checkbox]));
    } else {
      onChange(value.filter(function(x) { return x !== checkbox; }))
    }
  };

  return <FormGroup>
    { options.map( (el) => (
      <FormControlLabel key={el.id} control={
        <Checkbox onClick={function() {
            handleCheckboxChange(el.id, !valueOf(el.id));
        }}
          checked={valueOf(el.id)}
        />
      } label={el.label}
      />
    )) }
  </FormGroup>
};
export default CheckboxSelector;
