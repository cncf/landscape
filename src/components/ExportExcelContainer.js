import { connect } from 'react-redux';
import ExportExcel from './ExportExcel';
import { exportExcel } from '../reducers/mainReducer.js';


const mapStateToProps = () => ({
});
const mapDispatchToProps = {
  onExport: exportExcel
};

export default connect(mapStateToProps, mapDispatchToProps)(ExportExcel);
