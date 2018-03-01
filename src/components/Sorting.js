import React from 'react';
import { FormGroup, FormControl, FormLabel } from 'material-ui/Form';
import SortFieldContainer from './SortFieldContainer';
const Sorting = () => {
  return <FormGroup row>
        <FormControl component="fieldset">
          <FormLabel component="legend">Sort By</FormLabel>
          <SortFieldContainer />
        </FormControl>
      </FormGroup>;
};
export default Sorting;
