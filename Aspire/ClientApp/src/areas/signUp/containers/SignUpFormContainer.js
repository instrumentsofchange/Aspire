import { connect } from 'react-redux';
import {
  fetchProgramOptions,
  saveStudent
} from '../actions/sign-up-actions'
import SignUpForm from '../components/SignUpForm';

const mapStateToProps = (state) => ({ ...state.signUp });

const mapDispatchToProps = {
  fetchProgramOptions,
  saveStudent
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpForm);