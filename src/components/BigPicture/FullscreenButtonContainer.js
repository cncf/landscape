import { connect } from 'react-redux';
import FullscreenButton from './FullscreenButton';

import { makeFullscreenEnabled, makeFullscreenDisabled} from '../../reducers/mainReducer';

const mapStateToProps = (state) => ({
  isFullscreen: state.main.isFullscreen,
  isVisible: state.main.mainContentMode !== 'card'
});

const mapDispatchToProps = {
  enableFullscreen: makeFullscreenEnabled,
  disableFullscreen: makeFullscreenDisabled
};

export default connect(mapStateToProps, mapDispatchToProps)(FullscreenButton);
