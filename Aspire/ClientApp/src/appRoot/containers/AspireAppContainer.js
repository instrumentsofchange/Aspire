import { connect } from 'react-redux';
import App from '../components/App';
import { 
  getProfile,
  logoutUser
} from '../../areas/users/actions/authentication-actions';

const mapStateToProps = (state) => {
  return {
    initializing: state.app.isInitializing,
    user: state.users.authentication
  }
}

const mapDispatchToProps = {
  getProfile,
  logoutUser
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);