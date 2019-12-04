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
} from '../actions/edit-profile-actions';
import _ from 'lodash';

const defaultState = {
    pageLoading: true
};

export default (state = defaultState, action) => {
    const { type, payload, error } = action;

    let reducedState = { ...state };

    switch(type) {
        case FETCH_USER_PROFILE_REQUEST:
            reducedState = {
                ...state,
                pageLoading: true
            };
            break;

        case FETCH_USER_PROFILE_SUCCESS:
            reducedState = {
                ...state,
                pageLoading: false,
                user: payload
            };
            break;

        case SAVE_USER_PROFILE_REQUEST:
            reducedState = {
                ...state,
                savingProfile: true
            };
            break;
            
        case SAVE_USER_PROFILE_SUCCESS:
            reducedState = {
                ...state,
                savingProfile: false,
                userSaved: true
            };
            break;

        case SAVE_USER_LOGIN_INFO_REQUEST:
            reducedState = {
                ...state,
                savingLoginInfo: true
            };
            break;

        case SAVE_USER_LOGIN_INFO_SUCCESS:
            reducedState = {
                ...state,
                savingLoginInfo: false,
                loginInfoSaved: true
            }
            break;

        case REMOVE_LOGIN_INFO_ERROR:
            reducedState.savingLoginInfoError = null;
            break;
        
        case FETCH_USER_PROFILE_FAILURE:
            reducedState = {
                pageLoading: false,
                pageLoadingError: error
            };
            break;

        case SAVE_USER_PROFILE_FAILURE:
            reducedState = {
                ...state,
                savingProfile: false,
                savingProfileError: error
            };
            break;

        case SAVE_USER_LOGIN_INFO_FAILURE:
            reducedState = {
                ...state,
                savingLoginInfo: false,
                savingLoginInfoError: error
            };
            break;
    }

    return reducedState;
}