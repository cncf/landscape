import React from 'react';
import { FormGroup, FormControl, FormLabel } from 'material-ui/Form';
import GroupingTypeContainer from './GroupingTypeContainer';
const Grouping = () => {
  return <FormGroup row>
        <FormControl component="fieldset">
          <FormLabel component="legend">Grouping</FormLabel>
          <GroupingTypeContainer />
        </FormControl>
      </FormGroup>;
};
export default Grouping;
