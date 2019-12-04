import Request from '../../shared/request/aspire-request';
import { convertRoleValueToEnum, convertEnumToRoleValue } from '../../shared/enums/RolesEnum';

export const FETCH_USER_PROFILE_REQUEST = '@@aspire-app/FETCH_USER_PROFILE_REQUEST';
export const FETCH_USER_PROFILE_SUCCESS = '@@aspire-app/FETCH_USER_PROFILE_SUCCESS';
export const FETCH_USER_PROFILE_FAILURE = '@@aspire-app/FETCH_USER_PROFILE_FAILURE';
export const fetchUserProfile = () => dispatch => {

    dispatch({ type: FETCH_USER_PROFILE_REQUEST });

    Request.get(
        '/api/users/profile',
        response => {
            response.role = convertRoleValueToEnum(response.role);

            dispatch({
                type: FETCH_USER_PROFILE_SUCCESS,
                payload: response
            })
        },
        error => dispatch({
            type: FETCH_USER_PROFILE_FAILURE,
            error: error
        })
    );
}

export const SAVE_USER_PROFILE_REQUEST = '@@aspire-app/SAVE_USER_PROFILE_REQUEST';
export const SAVE_USER_PROFILE_SUCCESS = '@@aspire-app/SAVE_USER_PROFILE_SUCCESS';
export const SAVE_USER_PROFILE_FAILURE = '@@aspire-app/SAVE_USER_PROFILE_FAILURE';
export const saveProfile = (user) => dispatch => {

    dispatch({ type: SAVE_USER_PROFILE_REQUEST });

    user.role = convertEnumToRoleValue(user.role);
    
    Request.put(
        '/api/users',
        user,
        response => {
            if(response) {
                dispatch({
                    type: SAVE_USER_PROFILE_SUCCESS
                });
            } else {
                dispatch({
                    type: SAVE_USER_PROFILE_FAILURE
                });
            }
        },
        error => dispatch({
            type: SAVE_USER_PROFILE_FAILURE,
            error: error
        })
    );
}

export const SAVE_USER_LOGIN_INFO_REQUEST = '@@aspire-app/SAVE_USER_LOGIN_INFO_REQUEST';
export const SAVE_USER_LOGIN_INFO_SUCCESS = '@@aspire-app/SAVE_USER_LOGIN_INFO_SUCCESS';
export const SAVE_USER_LOGIN_INFO_FAILURE = '@@aspire-app/SAVE_USER_LOGIN_INFO_FAILURE';
export const saveLoginInfo = loginInfo => dispatch => {

    dispatch({ type: SAVE_USER_LOGIN_INFO_REQUEST });

    Request.put(
        '/api/users/updatelogin',
        loginInfo,
        () => dispatch({
            type: SAVE_USER_LOGIN_INFO_SUCCESS
        }),
        ({ body: { error: { message }}}) => dispatch({
            type: SAVE_USER_LOGIN_INFO_FAILURE,
            error: message
        })
    );
}

export const REMOVE_LOGIN_INFO_ERROR = '@@aspire-app/REMOVE_LOGIN_INFO_ERROR';
export const removeLoginInfoError = () => dispatch => dispatch({
    type: REMOVE_LOGIN_INFO_ERROR
});