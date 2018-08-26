import { connect } from 'react-redux';
import SwitchButton from './SwitchButton';
import { changeMainContentMode } from '../../reducers/mainReducer.js';


const mapStateToProps = (state) => ({
  mainContentMode: state.main.mainContentMode
});
const mapDispatchToProps = {
  changeMainContentMode: changeMainContentMode
};

export default connect(mapStateToProps, mapDispatchToProps)(SwitchButton);
