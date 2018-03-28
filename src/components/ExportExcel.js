import React from 'react';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';

const ExportExcel = ({onExport}) => {
  return (
    <IconButton className="resetfilters" disableRipple style={{ color:'#366fa8', fontSize:'0.8em', width:'100%', justifyContent:'flex-start' }} onClick={()=>onExport()} aria-label="Export Excel">
      <Icon style={{ fontSize:'1.2em'}}>settings_backup_restore</Icon> Export Excel
    </IconButton>
  );
};
export default ExportExcel;
