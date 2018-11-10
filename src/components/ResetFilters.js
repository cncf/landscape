import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import ResetIcon from '@material-ui/icons/SettingsBackupRestore';

const Filters = ({reset}) => {
  return (
    <IconButton className="resetfilters" disableRipple style={{ color:'#366fa8', fontSize:'0.8em', width:'100%', justifyContent:'flex-start' }} onClick={()=>reset()} aria-label="Reset Filters">
      <ResetIcon style={{ fontSize:'1.2em'}}/> Reset Filters
    </IconButton>
  );
};
export default Filters;
