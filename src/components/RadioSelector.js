import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

const idToValue = (id) => id !== null ? id : 'any';
const valueToId = (value) => value === 'any' ? null : value;

const RadioSelector = ({value, options, onChange}) => {
  return  <RadioGroup name="stars"
    value={idToValue(value)}
  >
    { options.map( (entry) => (
      <FormControlLabel
        key={idToValue(entry.id)}
        value={idToValue(entry.id)}
        control={<Radio  onClick={() => onChange(valueToId(entry.id))} />}
        label={entry.label}
      />
    )) }
  </RadioGroup>
};
export default RadioSelector;
