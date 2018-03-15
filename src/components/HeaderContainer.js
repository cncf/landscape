import { connect } from 'react-redux';
import Header from './Header';
import { resetParameters } from '../reducers/mainReducer.js';


const mapStateToProps = () => ({
});
const mapDispatchToProps = {
  reset: resetParameters
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
