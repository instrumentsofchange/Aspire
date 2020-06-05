import {
    FETCH_PROGRAMS_REQUEST,
    FETCH_PROGRAMS_SUCCESS,
    FETCH_PROGRAMS_FAILURE,
    CREATE_USER_REQUEST,
    CREATE_USER_SUCCESS,
    CREATE_USER_FAILURE
} from '../actions/create-user-actions';

const defaultState = {
    loading: true
}

export default (state = defaultState, action) => {
    const { type, payload, error } = action;

    let reducedState = { ...state };

    switch(type) {
        case FETCH_PROGRAMS_REQUEST:
            reducedState = {
                loading: true
            };
            break;

        case FETCH_PROGRAMS_SUCCESS:
            reducedState = {
                ...state,
                loading: false,
                programOptions: payload
            };
            break;

        case FETCH_PROGRAMS_FAILURE:
            reducedState = {
                loading: false,
                error: error
            };
            break;

        case CREATE_USER_REQUEST:
            reducedState = {
                ...state,
                loading: true
            };
            break;

        case CREATE_USER_SUCCESS:
            reducedState = {
                loading: false,
                createUserSuccess: true
            };
            break;

        case CREATE_USER_FAILURE:
            reducedState = {
                ...state,
                loading: false,
                createUserSuccess: false,
                createUserError: error
            };
            break;


    }

    return reducedState;
}