import { convertEnumToRoleValue } from '../../shared/enums/RolesEnum';

export const FETCH_PROGRAMS_REQUEST = '@@aspire-app/FETCH_PROGRAMS_REQUEST';
export const FETCH_PROGRAMS_SUCCESS = '@@aspire-app/FETCH_PROGRAMS_SUCCESS';
export const FETCH_PROGRAMS_FAILURE = '@@aspire-app/FETCH_PROGRAMS_FAILURE';
export const fetchPrograms = () => dispatch => {

    dispatch({ type: FETCH_PROGRAMS_REQUEST });

    fetch('/api/programs/options', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(parseJson)
    .then(response => handleErrors(response))
    .then(response => {
        dispatch({
            type: FETCH_PROGRAMS_SUCCESS,
            payload: response
        })
    })
    .catch(error => {
        dispatch({
            type: FETCH_PROGRAMS_FAILURE,
            error: error
        });
    });
}

export const CREATE_USER_REQUEST = '@@aspire-app/CREATE_USER_REQUEST';
export const CREATE_USER_SUCCESS = '@@aspire-app/CREATE_USER_SUCCESS';
export const CREATE_USER_FAILURE = '@@aspire-app/CREATE_USER_FAILURE';
export const createUser = (user) => dispatch => {

    dispatch({ type: CREATE_USER_REQUEST });    

    user.role = convertEnumToRoleValue(user.role);

    request('/api/users/create', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => (
        dispatch({
            type: CREATE_USER_SUCCESS
        })
    )).catch(error => {
        debugger;
        console.log(Object.keys(error));

        dispatch({
            type: CREATE_USER_FAILURE, 
            error: error.error.message
        })
    });

    // fetch('/api/users/create', {
    //     method: 'POST',
    //     body: JSON.stringify(user),
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // })
    // .then(parseJson)
    // .then(response => handleErrors(response))
    // .then(response => {
    //     dispatch({
    //         type: CREATE_USER_SUCCESS
    //     })
    // })
    // .catch(error => {
    //     debugger;
    //     dispatch({
    //         type: CREATE_USER_FAILURE, 
    //         error: error.message
    //     });
    // })
}

async function handleErrors (response) {
    if(!response.ok) {
        throw new Error(response.body);
    }

    return response.body;
}

function parseJson(response) {
    return new Promise((resolve) => response.json()
      .then((json) => resolve({
        status: response.status,
        ok: response.ok,
        body: json,
      })));
}

function request(url, options) {
    return new Promise((resolve, reject) => {
        fetch(url, options)
            .then(parseJson)
            .then(response => {
                if(response.ok) {
                    return resolve(response.body);
                }

                return reject(response.body);
            });
    })
}