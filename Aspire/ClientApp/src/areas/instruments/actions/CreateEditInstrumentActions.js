export const GET_INITIAL_INSTRUMENT_FORM_OPTIONS_REQUEST = '@@aspire-app/GET_INITIAL_INSTRUMENT_FORM_OPTIONS_REQUEST';
export const GET_INITIAL_INSTRUMENT_FORM_OPTIONS_SUCCESS = '@@aspire-app/GET_INITIAL_INSTRUMENT_FORM_OPTIONS_SUCCESS';
export const GET_INITIAL_INSTRUMENT_FORM_OPTIONS_FAILURE = '@@aspire-app/GET_INITIAL_INSTRUMENT_FORM_OPTIONS_FAILURE';
export const getInitialInstrumentFormOptions = () => dispatch => {

    dispatch({ type: GET_INITIAL_INSTRUMENT_FORM_OPTIONS_REQUEST });

    fetch('/api/instruments/GetInitialInstrumentFormOptions', {
        type: 'GET',
        headers: {
            'Content-type': 'application/json'
        }
    })
    .then(response => handleErrors(response))
    .then(response => {
        dispatch({
            type: GET_INITIAL_INSTRUMENT_FORM_OPTIONS_SUCCESS,
            payload: response
        });
    })
    .catch(error => {
        dispatch({ 
            type: GET_INITIAL_INSTRUMENT_FORM_OPTIONS_FAILURE,
            error: error
        }); 
    });
}

export const GET_MODEL_OPTIONS_REQUEST = '@@aspire-app/GET_MODEL_OPTIONS_REQUEST';
export const GET_MODEL_OPTIONS_SUCCESS = '@@aspire-app/GET_MODEL_OPTIONS_SUCCESS';
export const GET_MODEL_OPTIONS_FAILURE = '@@aspire-app/GET_MODEL_OPTIONS_FAILURE';
export const getModelOptions = make => dispatch => {

    dispatch({ type: GET_MODEL_OPTIONS_REQUEST });

    fetch(`/api/instruments/getModelOptions/${make}`, {
        type: 'GET',
        headers: {
            'Content-type': 'application/json'
        }
    })
    .then(response => handleErrors(response))
    .then(response => {
        dispatch({
            type: GET_MODEL_OPTIONS_SUCCESS,
            payload: response
        });
    })
    .catch(error => {
        dispatch({
            type: GET_MODEL_OPTIONS_FAILURE,
            error: error
        });
    });
}

export const GET_STUDENT_OPTIONS_REQUEST = '@@aspire-app/GET_STUDENT_OPTIONS_REQUEST';
export const GET_STUDENT_OPTIONS_SUCCESS = '@@aspire-app/GET_STUDENT_OPTIONS_SUCCESS';
export const GET_STUDENT_OPTIONS_FAILURE = '@@aspire-app/GET_STUDENT_OPTIONS_FAILURE';
export const getStudentOptions = program => dispatch => {

    dispatch({ type: GET_STUDENT_OPTIONS_REQUEST });
   
    fetch(`/api/instruments/getStudentOptions/${program}`, {
        type: 'GET',
        headers: {
            'Content-type': 'application/json'
        }
    })
    .then(response => handleErrors(response))
    .then(response => {
        debugger;
        dispatch({ 
            type: GET_STUDENT_OPTIONS_SUCCESS,
            payload: response
        });
    })
    .catch(error => {
        dispatch({ 
            type: GET_STUDENT_OPTIONS_FAILURE,
            error: error
        });
    });
}

export const GET_INSTRUMENT_TO_EDIT_REQUEST = '@@aspire-app/GET_INSTRUMENT_TO_EDIT_REQUEST';
export const GET_INSTRUMENT_TO_EDIT_SUCCESS = '@@aspire-app/GET_INSTRUMENT_TO_EDIT_SUCCESS';
export const GET_INSTRUMENT_TO_EDIT_FAILURE = '@@aspire-app/GET_INSTRUMENT_TO_EDIT_FAILURE';
export const getInstrumentToEdit = instrumentId => dispatch => {

    dispatch({ type: GET_INSTRUMENT_TO_EDIT_REQUEST });

    fetch(`/api/instruments/${instrumentId}`, {
        type: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => handleErrors(response))
    .then(response => {
        dispatch({
            type: GET_INSTRUMENT_TO_EDIT_SUCCESS,
            payload: response
        });
    })
    .catch(error => {
        dispatch({
            type: GET_INSTRUMENT_TO_EDIT_FAILURE,
            error: error
        });
    })

}

export const SAVE_INSTRUMENT_REQUEST = '@@aspire-app/SAVE_INSTRUMENT_REQUEST';
export const SAVE_INSTRUMENT_SUCCESS = '@@aspire-app/SAVE_INSTRUMENT_SUCCESS';
export const SAVE_INSTRUMENT_FAILURE = '@@aspire-app/SAVE_INSTRUMENT_FAILURE';
export const saveInstrument = instrument => dispatch => {
    
    dispatch({ type: SAVE_INSTRUMENT_REQUEST });

    fetch('/api/instruments', {
        method: 'POST',
        body: JSON.stringify(instrument),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => handleErrors(response))
    .then(response => {
        window.location = '';
        dispatch({ type: SAVE_INSTRUMENT_SUCCESS });
    })
    .catch(error => {
        dispatch({
            type: SAVE_INSTRUMENT_FAILURE,
            error: error
        });
    })
}

const handleErrors = (response) => {
    if(!response.ok) {
        throw Error(response.statusText);
    }

    return response.json();
}