import React from 'react';
import ResetIcon from '@material-ui/icons/SettingsBackupRestore';

const Filters = ({reset}) => {
  return (
    <div className="filters-action" onClick={()=>reset()} aria-label="Reset Filters">
      <ResetIcon /><span>Reset Filters</span>
    </div>
  );
};
export default Filters;
