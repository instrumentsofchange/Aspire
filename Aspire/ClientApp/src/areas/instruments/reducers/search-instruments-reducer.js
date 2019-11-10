import {
    GET_INSTRUMENTS_SEARCH_FORM_INITIAL_VALUES_REQUEST,
    GET_INSTRUMENTS_SEARCH_FORM_INITIAL_VALUES_SUCCESS,
    GET_INSTRUMENTS_SEARCH_FORM_INITIAL_VALUES_FAILURE,
    SEARCH_INSTRUMENTS_REQUEST,
    SEARCH_INSTRUMENTS_FAILURE,
    SEARCH_INSTRUMENTS_SUCCESS
} from '../actions/SearchInstrumentsAction';

const defaultState = {
    pageLoading: true
};

export default (state = defaultState, action) => {
    const {
        type,
        payload,
        error
    } = action;

    let reducedState = {...state};

    switch(type) {
        case GET_INSTRUMENTS_SEARCH_FORM_INITIAL_VALUES_REQUEST:
            reducedState = {
                ...state,
                pageLoading: true
            };
            break;

        case GET_INSTRUMENTS_SEARCH_FORM_INITIAL_VALUES_SUCCESS:
            reducedState = {
                pageLoading: false,
                makeOptions: payload
            };
            break;

        case SEARCH_INSTRUMENTS_REQUEST:
            reducedState = {
                ...state,
                searchResults: [],
                searchLoading: true
            };
            break;

        case SEARCH_INSTRUMENTS_SUCCESS:
            reducedState = {
                ...state,
                searchLoading: false,
                searchResults: payload
            };
            break;

        case GET_INSTRUMENTS_SEARCH_FORM_INITIAL_VALUES_FAILURE:
        case SEARCH_INSTRUMENTS_FAILURE:
            reducedState = {
                pageLoading: false,
                searchLoading: false,
                error: error
            };
            break;
    }

    return reducedState;
} 