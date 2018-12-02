import { connect } from 'react-redux';
import FullscreenLandscape from './FullscreenLandscape';

const mapStateToProps = (state) => ({
  ready: state.main.ready,
});
const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(FullscreenLandscape);
