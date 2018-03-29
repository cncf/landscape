import React from 'react';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';

const ExportExcel = ({onExport}) => {
  return (
    <IconButton className="resetfilters" disableRipple style={{ color:'#366fa8', fontSize:'0.8em', width:'100%', justifyContent:'flex-start' }} onClick={()=>onExport()} aria-label="Download as CSV">
      <Icon style={{ fontSize:'1.2em'}}>system_update_alt</Icon>&nbsp; Download as CSV
    </IconButton>
  );
};
export default ExportExcel;
