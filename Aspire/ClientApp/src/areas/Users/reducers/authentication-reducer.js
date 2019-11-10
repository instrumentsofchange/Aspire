import {
    AUTHENTICATE_USER_REQUEST,
    AUTHENTICATE_USER_SUCCESS,
    AUTHENTICATE_USER_FAILURE,
    GET_PROFILE_REQUEST,
    GET_PROFILE_FAILURE,
    LOGOUT_USER_REQUEST,
    LOGOUT_USER_SUCCESS,
    LOGOUT_USER_FAILURE
} from '../actions/authentication-actions'

const defaultState = {
    isLoading: false,
    isAuthenticated: false
}

export default (state = defaultState, action) => {
    const { type, user, invalidLogin, error } = action;

    let reducedState = { ...state };

    switch (type) {
        case AUTHENTICATE_USER_REQUEST:
        // case GET_PROFILE_REQUEST:
        case LOGOUT_USER_REQUEST:
            reducedState = {
                isLoading: true,
                isAuthenticated: false,
                invalidLogin: null,
            };
            break;

        case AUTHENTICATE_USER_SUCCESS:
            reducedState = {
                ...user,
                isLoading: false,
                isAuthenticated: true,
            };
            break;

        case LOGOUT_USER_SUCCESS:
            reducedState = {
                isLoading: false,
                isAuthenticated: false
            };
            break;

        case AUTHENTICATE_USER_FAILURE:
            reducedState = {
                isLoading: false,
                isAuthenticated: false,

            };

            if(invalidLogin) {
                reducedState.invalidLogin = true;
            }

            break;

        case GET_PROFILE_FAILURE:
        case LOGOUT_USER_FAILURE:
            reducedState = {
                isLoading: false,
                isAuthenticated: false,
                error: error
            }
            break;
    }

    return reducedState;
}