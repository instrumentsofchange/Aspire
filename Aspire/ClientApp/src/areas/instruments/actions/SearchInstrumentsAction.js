export const GET_INSTRUMENTS_SEARCH_FORM_INITIAL_VALUES_REQUEST = '@@aspire-app/GET_INSTRUMENTS_SEARCH_FORM_INITIAL_VALUES_REQUEST';
export const GET_INSTRUMENTS_SEARCH_FORM_INITIAL_VALUES_SUCCESS = '@@aspire-app/GET_INSTRUMENTS_SEARCH_FORM_INITIAL_VALUES_SUCCESS';
export const GET_INSTRUMENTS_SEARCH_FORM_INITIAL_VALUES_FAILURE = '@@aspire-app/GET_INSTRUMENTS_SEARCH_FORM_INITIAL_VALUES_FAILURE';
export const getSearchFormInitialValues = () => dispatch => {

    dispatch({ type: GET_INSTRUMENTS_SEARCH_FORM_INITIAL_VALUES_REQUEST });

    fetch('/api/instruments/getMakeOptions', {
        type: 'GET',
        headers: {
            'Content-type': 'application/json'
        }
    })
    .then(response => handleErrors(response))
    .then(response => {
        dispatch({
            type: GET_INSTRUMENTS_SEARCH_FORM_INITIAL_VALUES_SUCCESS,
            payload: response
        });
    })
    .catch(error => {
        dispatch({
            type: GET_INSTRUMENTS_SEARCH_FORM_INITIAL_VALUES_FAILURE,
            error: error
        })
    })
}

export const SEARCH_INSTRUMENTS_REQUEST = '@@aspire-app/SEARCH_INSTRUMENTS_REQUEST';
export const SEARCH_INSTRUMENTS_SUCCESS = '@@aspire-app/SEARCH_INSTRUMENTS_SUCCESS';
export const SEARCH_INSTRUMENTS_FAILURE = '@@aspire-app/SEARCH_INSTRUMENTS_FAILURE';
export const searchInstruments = searchRequest => dispatch => {

    dispatch({ type: SEARCH_INSTRUMENTS_REQUEST });

    const { serialNumber, make } = searchRequest;

    fetch(`/api/instruments/search?serialNumber=${serialNumber}&make=${make}`, {
        type: 'GET',
        headers: {
            'Content-type': 'application/json'
        }
    })
    .then(response => handleErrors(response))
    .then(response => {
        dispatch({
            type: SEARCH_INSTRUMENTS_SUCCESS,
            payload: response
        });
    })
    .catch(error => {
        dispatch({
            type: SEARCH_INSTRUMENTS_FAILURE,
            error: error
        });
    });
}

const handleErrors = (response) => {
    if(!response.ok) {
        throw Error(response.statusText);
    }

    return response.json();
}