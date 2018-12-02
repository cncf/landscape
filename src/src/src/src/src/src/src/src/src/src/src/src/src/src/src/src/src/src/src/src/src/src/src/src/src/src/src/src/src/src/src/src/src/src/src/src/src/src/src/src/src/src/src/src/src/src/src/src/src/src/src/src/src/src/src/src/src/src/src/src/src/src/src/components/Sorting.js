import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
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
