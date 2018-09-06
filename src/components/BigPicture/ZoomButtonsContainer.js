import { connect } from 'react-redux';
import ZoomButtons from './ZoomButtons';
import { makeZoomIn, makeZoomOut, makeZoomReset} from '../../reducers/mainReducer';
import { zoomLevels } from '../../utils/zoom';


const mapStateToProps = (state) => ({
  canZoomOut: state.main.zoom !== zoomLevels[0],
  canZoomIn: state.main.zoom !== zoomLevels.slice(-1)[0],
  zoomText: state.main.zoom * 100 + '%'
});

const mapDispatchToProps = {
  onZoomIn: makeZoomIn,
  onZoomOut: makeZoomOut,
  onZoomReset: makeZoomReset
};

export default connect(mapStateToProps, mapDispatchToProps)(ZoomButtons);
