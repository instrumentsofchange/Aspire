import { convertEnumToRoleValue } from '../../shared/enums/RolesEnum';
import Request from '../../shared/request/aspire-request';

export const FETCH_PROGRAMS_REQUEST = '@@aspire-app/FETCH_PROGRAMS_REQUEST';
export const FETCH_PROGRAMS_SUCCESS = '@@aspire-app/FETCH_PROGRAMS_SUCCESS';
export const FETCH_PROGRAMS_FAILURE = '@@aspire-app/FETCH_PROGRAMS_FAILURE';
export const fetchPrograms = () => dispatch => {

    dispatch({ type: FETCH_PROGRAMS_REQUEST });

    Request.get('/api/programs/options',
        response => dispatch({
            type: FETCH_PROGRAMS_SUCCESS,
            payload: response
        }),
        ({ body: { error: { message }}}) => dispatch({
            type: FETCH_PROGRAMS_FAILURE,
            error: message
        })
    );
}

export const CREATE_USER_REQUEST = '@@aspire-app/CREATE_USER_REQUEST';
export const CREATE_USER_SUCCESS = '@@aspire-app/CREATE_USER_SUCCESS';
export const CREATE_USER_FAILURE = '@@aspire-app/CREATE_USER_FAILURE';
export const createUser = (user) => dispatch => {

    dispatch({ type: CREATE_USER_REQUEST });    

    user.role = convertEnumToRoleValue(user.role);

    Request.post(
        '/api/users/create', 
        JSON.stringify(user),
        response => {
            dispatch({
                type: CREATE_USER_SUCCESS
            });
        },
        ({ body: { error: { message }}}) => {
            dispatch({
                type: CREATE_USER_FAILURE,
                error: message
            });
        }
    );
}

function parseJson(response) {
    return new Promise((resolve) => response.json()
      .then((json) => resolve({
        status: response.status,
        ok: response.ok,
        body: json,
      })));
}