import { connect } from 'react-redux';
import ZoomButtons from './ZoomButtons';
import { zoomIn, zoomOut} from '../../reducers/mainReducer';
import { zoomLevels } from '../../utils/zoom';


const mapStateToProps = (state) => ({
  canZoomOut: state.main.zoom !== zoomLevels[0],
  canZoomIn: state.main.zoom !== zoomLevels.slice(-1)[0]
});

const mapDispatchToProps = {
  onZoomIn: zoomIn,
  onZoomOut: zoomOut
};

export default connect(mapStateToProps, mapDispatchToProps)(ZoomButtons);
