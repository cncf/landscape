import { connect } from 'react-redux';
import BigPictureButton from './BigPictureButton';
import { enableBigPicture, disableBigPicture } from '../reducers/mainReducer.js';


const mapStateToProps = (state) => ({
  isBigPicture: state.main.isBigPicture
});
const mapDispatchToProps = {
  enableBigPicture: enableBigPicture,
  disableBigPicture: disableBigPicture
};

export default connect(mapStateToProps, mapDispatchToProps)(BigPictureButton);
