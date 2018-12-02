import { connect } from 'react-redux';
import ResetFilters from './ResetFilters';
import { resetParameters } from '../reducers/mainReducer.js';


const mapStateToProps = () => ({
});
const mapDispatchToProps = {
  reset: resetParameters
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetFilters);
