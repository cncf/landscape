import { connect } from 'react-redux';
import Zoom from './Zoom';


const mapStateToProps = (state) => ({
  zoom: state.main.zoom
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Zoom);
