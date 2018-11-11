import React from 'react';
import SystemUpdateIcon from '@material-ui/icons/SystemUpdate';
import IconButton from '@material-ui/core/IconButton';

const ExportCsv = ({onExport}) => {
  return (
    <IconButton disableRipple style={{ color:'#366fa8', fontSize:'0.8em', width:'100%', justifyContent:'flex-start' }} onClick={()=>onExport()} aria-label="Download as CSV">
      <SystemUpdateIcon style={{ fontSize:'1.2em'}} />&nbsp; Download as CSV
    </IconButton>
  );
};
export default ExportCsv;
