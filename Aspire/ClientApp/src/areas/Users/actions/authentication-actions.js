import { APP_INITIALIZATION_SUCCESS } from '../../../appRoot/AppActions';
import { convertRoleValueToEnum } from '../../shared/enums/RolesEnum';

export const AUTHENTICATE_USER_REQUEST = '@@aspire-app/AUTHENTICATE_USER_REQUEST';
export const AUTHENTICATE_USER_SUCCESS = '@@aspire-app/AUTHENTICATE_USER_SUCCESS';
export const AUTHENTICATE_USER_FAILURE = '@@aspire-app/AUTHENTICATE_USER_FAILURE';

export const authenticateUser = (credentials) => dispatch => {
    
    dispatch({ type: AUTHENTICATE_USER_REQUEST });

    /*
        For a successful loging, this api call expects an object in the form:
        {
            user: {
                username: 'kaebischer',
                email: 'kyleaebischer@hotmail.com',
                role: 'Admin'
            },
            jwt: 'aaaaaaaa.bbbbbbbbb.ccccccccc',
            success: true
        }

        unsuccessful:
        {
            succcess: false
        }
    */
    
    fetch('/api/users/authenticate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
    .then(response => handleErrors(response))
    .then(response => {
        if(response.success ) {

            /*
                For now, the jwt will be an object like this:
                {
                    username: 'kaebischer',
                    expires: someDate...
                }
            */

            console.log(JSON.stringify(response.jwt));
            localStorage.setItem('user_token', JSON.stringify(response.jwt));

            dispatch({ 
                type: AUTHENTICATE_USER_SUCCESS, 
                user: response.user 
            });

            window.location.reload();
        } else {
            dispatch({
                type: AUTHENTICATE_USER_FAILURE,
                invalidLogin: true
            });
        }
    })
    .catch(error => {
        dispatch({ 
            type: AUTHENTICATE_USER_FAILURE,
            error: error.statusText
        });
    });
}

export const GET_PROFILE_REQUEST = '@@aspire-app/GET_PROFILE_REQUEST';
export const GET_PROFILE_FAILURE = '@@aspire-app/GET_PROFILE_FAILURE';
export const getProfile = () => dispatch => {
    //This method looks to see if a user is still logged in from their last session
    //If they are, the api will return their user profile and if not, it will return a fals success flag
    dispatch({ type: GET_PROFILE_REQUEST });

    const token = localStorage.user_token;

    if(token) {
        const jwt = JSON.parse(token);

        fetch(`/api/users/profile?jwt=${token}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'username': jwt.username,
                'expirationDate': jwt.expiration
            }
        })
        .then(response => response.json())
        .then(response => {
            if(response.success) {

                response.user.role = convertRoleValueToEnum(response.user.role);

                dispatch({ 
                    type: AUTHENTICATE_USER_SUCCESS, 
                    user: response.user
                });
            } else {
                localStorage.removeItem('user_token');
            }
            
            dispatch({ type: APP_INITIALIZATION_SUCCESS });
        });
    } else {
        dispatch({ type: APP_INITIALIZATION_SUCCESS });
    }
}

export const LOGOUT_USER_REQUEST = '@@aspire-app/LOGOUT_USER_REQUEST';
export const LOGOUT_USER_SUCCESS = '@@aspire-app/LOGOUT_USER_SUCCESS';
export const LOGOUT_USER_FAILURE = '@@aspire-app/LOGOUT_USER_FAILURE';

export const logoutUser = () => dispatch => {
    dispatch({ type: LOGOUT_USER_REQUEST });

    localStorage.removeItem('user_token');

    dispatch({ type: LOGOUT_USER_SUCCESS });
}

const handleErrors = (response) => {
    if(!response.ok && response.status >= 500) {
        throw Error(response);
    }

    return response.json();
}

/*
example JWT
{
    //Header
    {
        "alg": "HS256",
        "typ": "JWT"
    },

    //payload
    {
        "username": "kaebischer",
        "role": "admin",
        "expiration": "Tue Oct 01 2019 17:26:05 GMT-0400 (Eastern Daylight Time)"
    },

    //Signature
    {}
}
*/