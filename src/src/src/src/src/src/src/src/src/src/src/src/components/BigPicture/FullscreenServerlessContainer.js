import { connect } from 'react-redux';
import FullscreenServerless from './FullscreenServerless';

const mapStateToProps = (state) => ({
  ready: state.main.ready,
});
const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(FullscreenServerless);
