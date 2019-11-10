import { connect } from 'react-redux';
import UserProfile from '../components/UserProfile';

const mapStateToProps = (state) => {
    return state.users.authentication.username;
}

const mapDispatchToProps = {

};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserProfile);