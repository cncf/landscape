import { connect } from 'react-redux';
import ZoomButtons from './ZoomButtons';
import { makeZoomIn, makeZoomOut} from '../../reducers/mainReducer';
import { zoomLevels } from '../../utils/zoom';


const mapStateToProps = (state) => ({
  canZoomOut: state.main.zoom !== zoomLevels[0],
  canZoomIn: state.main.zoom !== zoomLevels.slice(-1)[0]
});

const mapDispatchToProps = {
  onZoomIn: makeZoomIn,
  onZoomOut: makeZoomOut
};

export default connect(mapStateToProps, mapDispatchToProps)(ZoomButtons);
