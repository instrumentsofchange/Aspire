import { connect } from 'react-redux'
import {
	fetchUserProfile,
	saveProfile,
	saveLoginInfo, removeLoginInfoError
} from '../actions/edit-profile-actions'
import UserProfile from '../components/UserProfile'

const mapStateToProps = (state) => {
	return state.users.userProfile
}

const mapDispatchToProps = dispatch => ({
	fetchUserProfile: () => dispatch(fetchUserProfile()),

	saveProfile: profile => {
		dispatch(saveProfile(profile))
			.then(() => dispatch(fetchUserProfile()))
			.catch(error => console.error(error))
	},

	saveLoginInfo: loginInfo => dispatch(saveLoginInfo(loginInfo)),

	removeLoginInfoError: () => dispatch(removeLoginInfoError())

})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UserProfile)