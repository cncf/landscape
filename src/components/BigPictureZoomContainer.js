import { connect } from 'react-redux';
import BigPictureZoom from './BigPictureZoom';


const mapStateToProps = (state) => ({
  zoom: state.main.zoom
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(BigPictureZoom);
