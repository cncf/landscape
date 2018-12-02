import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
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
