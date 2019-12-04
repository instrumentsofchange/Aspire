import { connect } from 'react-redux';
import {
    fetchUserProfile,
    saveProfile,
    saveLoginInfo,removeLoginInfoError
} from '../actions/edit-profile-actions';
import UserProfile from '../components/UserProfile';

const mapStateToProps = (state) => {
    return state.users.userProfile;
}

const mapDispatchToProps = {
    fetchUserProfile,
    saveProfile,
    saveLoginInfo,
    removeLoginInfoError
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserProfile);