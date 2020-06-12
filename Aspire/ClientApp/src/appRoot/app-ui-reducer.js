import {
    APP_INITIALIZATION_REQUEST,
    APP_INITIALIZATION_SUCCESS,
    APP_INITIALIZATION_FAILURE
} from './AppActions';

import { 
    GET_PROFILE_REQUEST,
    GET_PROFILE_FAILURE
} from '../areas/users/actions/authentication-actions';

const defaultState = {
    isInitializing: true
}

export default (state = defaultState, action) => {

    const { type, error } =  action;

    let reducedState = { ...state }

    switch(type) {
        case APP_INITIALIZATION_REQUEST:
        case GET_PROFILE_REQUEST:
            reducedState = {
                isInitializing: true
            }
            break;
        
        case APP_INITIALIZATION_SUCCESS:
            reducedState = {
                isInitializing: false
            }
            break;

        case APP_INITIALIZATION_FAILURE:
        case GET_PROFILE_FAILURE:
            reducedState = {
                isInitializing: false,
                error: error
            }
            break;
    }

    return reducedState;
}