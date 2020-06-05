import {
	FETCH_USER_PROFILE_REQUEST,
	FETCH_USER_PROFILE_SUCCESS,
	FETCH_USER_PROFILE_FAILURE,
	SAVE_USER_PROFILE_REQUEST,
	SAVE_USER_PROFILE_SUCCESS,
	SAVE_USER_PROFILE_FAILURE,
	SAVE_USER_LOGIN_INFO_REQUEST,
	SAVE_USER_LOGIN_INFO_SUCCESS,
	SAVE_USER_LOGIN_INFO_FAILURE,
	REMOVE_LOGIN_INFO_ERROR
} from '../actions/edit-profile-actions'
import _ from 'lodash'

const defaultState = {
	pageLoading: true
}

export default (state = defaultState, { type, payload, error }) => {
	let reducedState = { ...state }

	const reduceAction = changes => ({
		...state,
		...changes
	})

	switch (type) {
		case FETCH_USER_PROFILE_REQUEST:
			reducedState = reduceAction({
				pageLoading: true,
				pageLoadingError: null
			})
			break

		case FETCH_USER_PROFILE_SUCCESS:
			reducedState = reduceAction({
				pageLoading: false,
				user: payload
			})
			break

		case FETCH_USER_PROFILE_FAILURE:
			reducedState = reduceAction({
				pageLoading: false,
				pageLoadingError: error
			})
			break

		case SAVE_USER_PROFILE_REQUEST:
			reducedState = reduceAction({
				savingProfile: true,
				savingProfileError: null
			})
			break

		case SAVE_USER_PROFILE_SUCCESS:
			reducedState = reduceAction({
				savingProfile: false
			})
			break

		case SAVE_USER_PROFILE_FAILURE:
			reducedState = reduceAction({
				savingProfile: false,
				savingProfileError: error
			})
			break

		case SAVE_USER_LOGIN_INFO_REQUEST:
			reducedState = reduceAction({
				savingLoginInfo: true,
				savingLoginInfoError: null
			})
			break

		case SAVE_USER_LOGIN_INFO_SUCCESS:
			reducedState = reduceAction({
				savingLoginInfo: false
			})
			break

		case SAVE_USER_LOGIN_INFO_FAILURE:
			reducedState = reduceAction({
				savingLoginInfo: false,
				savingLoginInfoError: error
			})
			break

		case REMOVE_LOGIN_INFO_ERROR:
			reducedState = reduceAction({
				savingLoginInfoError: null
			})
			break
	}

	return reducedState
}