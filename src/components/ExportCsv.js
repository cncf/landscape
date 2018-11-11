import React from 'react';
import SystemUpdateIcon from '@material-ui/icons/SystemUpdate';

const ExportCsv = ({onExport}) => {
  return (
    <div className="filters-action" onClick={()=>onExport()} aria-label="Download as CSV">
      <SystemUpdateIcon /><span>Download as CSV</span>
    </div>
  );
};
export default ExportCsv;
