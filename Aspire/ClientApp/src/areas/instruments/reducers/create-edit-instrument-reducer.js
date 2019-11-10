import {
    GET_INITIAL_INSTRUMENT_FORM_OPTIONS_REQUEST,
    GET_INITIAL_INSTRUMENT_FORM_OPTIONS_SUCCESS,
    GET_INITIAL_INSTRUMENT_FORM_OPTIONS_FAILURE,
    GET_MODEL_OPTIONS_REQUEST,
    GET_MODEL_OPTIONS_SUCCESS,
    GET_MODEL_OPTIONS_FAILURE,
    GET_STUDENT_OPTIONS_REQUEST,
    GET_STUDENT_OPTIONS_SUCCESS,
    GET_STUDENT_OPTIONS_FAILURE,
    GET_INSTRUMENT_TO_EDIT_REQUEST,
    GET_INSTRUMENT_TO_EDIT_SUCCESS,
    GET_INSTRUMENT_TO_EDIT_FAILURE,
    SAVE_INSTRUMENT_REQUEST,
    SAVE_INSTRUMENT_SUCCESS,
    SAVE_INSTRUMENT_FAILURE
} from '../actions/CreateEditInstrumentActions';

const defaultState = {
    pageLoading: true,
    instrumentTypeOptions: [],
    programOptions: [],
    makeOptions: [],
    modelOptions: [],
    studentOptions: []
}

export default (state = defaultState, action) => {
    const { type, payload, error } = action;

    let reducedState = {...state};

    switch(type) {
        case GET_INITIAL_INSTRUMENT_FORM_OPTIONS_REQUEST:
        case GET_INSTRUMENT_TO_EDIT_REQUEST:
        case SAVE_INSTRUMENT_REQUEST:
            reducedState = {
                ...state,
                pageLoading: true
            };
            break;

        case GET_INITIAL_INSTRUMENT_FORM_OPTIONS_SUCCESS:
            reducedState = {
                ...state,
                pageLoading: false,
                instrumentTypeOptions: payload.instrumentTypeOptions,
                programOptions: payload.programOptions,
                makeOptions: payload.makeOptions
            };
            break;

        case GET_MODEL_OPTIONS_REQUEST:
            reducedState = {
                ...state,
                modelOptionsLoading: true
            };
            break;

        case GET_MODEL_OPTIONS_SUCCESS:
            reducedState = {
                ...state,
                modelOptionsLoading: false,
                modelOptions: payload
            };
            break;

        case GET_STUDENT_OPTIONS_REQUEST:
            reducedState = {
                ...state,
                studentOptionsLoading: true
            };
            break;

        case GET_STUDENT_OPTIONS_SUCCESS:
            reducedState = {
                ...state,
                studentOptionsLoading: false,
                studentOptions: payload
            };
            break;

        case GET_INSTRUMENT_TO_EDIT_SUCCESS:
            reducedState = {
                ...state, 
                pageLoading: false,
                instrument: payload.instrument,
                instrumentTypeOptions: payload.instrumentTypeOptions,
                modelOptions: payload.modelOptions,
                makeOptions: payload.makeOptions,
                programOptions: payload.programOptions
                //student options
            };
            break;

        case SAVE_INSTRUMENT_SUCCESS:
            reducedState = {
                saveSuccessful: true
            };
            break;

        case GET_INITIAL_INSTRUMENT_FORM_OPTIONS_FAILURE:
        case GET_MODEL_OPTIONS_FAILURE:
        case GET_STUDENT_OPTIONS_FAILURE:
        case GET_INSTRUMENT_TO_EDIT_FAILURE:
        case SAVE_INSTRUMENT_FAILURE:
            reducedState = {
                pageLoading: false,
                error: error
            }
            break;
    }

    return reducedState;
}