import {
  FETCH_INSTRUMENT_FORM_CONSTANTS_REQUEST,
  FETCH_INSTRUMENT_FORM_CONSTANTS_SUCCESS,
  FETCH_INSTRUMENT_FORM_CONSTANTS_FAILURE,
  FETCH_MODEL_OPTIONS_REQUEST,
  FETCH_MODEL_OPTIONS_SUCCESS,
  FETCH_MODEL_OPTIONS_FAILURE,
  FETCH_STUDENT_OPTIONS_REQUEST,
  FETCH_STUDENT_OPTIONS_SUCCESS,
  FETCH_STUDENT_OPTIONS_FAILURE,
  FETCH_INSTRUMENT_REQUEST,
  FETCH_INSTRUMENT_SUCCESS,
  FETCH_INSTRUMENT_FAILURE,
  SAVE_INSTRUMENT_REQUEST,
  SAVE_INSTRUMENT_SUCCESS,
  SAVE_INSTRUMENT_FAILURE
} from '../actions/instrument-form-data-actions'

import { HIDE_FORM_MODAL } from '../../ui/actions/instruments-ui-actions'

const defaultState = {
  loadingFormConstants: false,
  formConstants: {
    typeOptions: [],
    makeOptions: [],
    modelOptions: [],
    programOptions: [],
    studentOptions: [],
    statusOptions: []
  },
  loadingFormConstantsError: null,
  loadingModelOptions: false,
  loadingModelOptionsError: null,
  loadingInstrument: false,
  instrument: {},
  loadingInstrumentError: null,
  savingInstrument: false,
  savingInstrumentError: null
}

export default (state = defaultState, { type, payload, error }) => {
  let reducedState = { ...state }

  const reduceAction = changes => ({
    ...state, 
    ...changes
  })

  switch(type) {

    case FETCH_INSTRUMENT_FORM_CONSTANTS_REQUEST:
      reducedState = reduceAction({
        loadingFormConstants: true,
        formConstants: { ...defaultState.formConstants },
        loadingFormConstantsError: null
      })
      break

    case FETCH_INSTRUMENT_FORM_CONSTANTS_SUCCESS:
      reducedState = reduceAction({
        loadingFormConstants: false,
        formConstants: {
          ...state.formConstants,
          ...payload
        }
      })
      break

    case FETCH_INSTRUMENT_FORM_CONSTANTS_FAILURE:
      reducedState = reduceAction({
        loadingFormConstants: false,
        loadingFormConstantsError: error
      })
      break

    case FETCH_MODEL_OPTIONS_REQUEST:
      reducedState = reduceAction({
        loadingModelOptions: true,
        formConstants: {
          ...state.formConstants,
          modelOptions: []
        },
        loadingModelOptionsError: null
      })
      break

    case FETCH_MODEL_OPTIONS_SUCCESS:
      reducedState = reduceAction({
        loadingModelOptions: false,
        formConstants: {
          ...state.formConstants,
          modelOptions: payload
        }
      })
      break

    case FETCH_MODEL_OPTIONS_FAILURE:
      reducedState = reduceAction({
        loadingModelOptions: false,
        loadingModelOptionsError: error
      })
      break

    case FETCH_STUDENT_OPTIONS_REQUEST:
      reducedState = reduceAction({
        loadingStudentOptions: true,
        formConstants: {
          ...state.formConstants,
          studentOptions: []
        },
        loadingStudentOptionsError: null
      })
      break

    case FETCH_STUDENT_OPTIONS_SUCCESS:
      reducedState = reduceAction({
        loadingStudentOptions: false,
        formConstants: {
          ...state.formConstants,
          studentOptions: payload
        }
      })
      break

    case FETCH_STUDENT_OPTIONS_FAILURE:
      reducedState = reduceAction({
        loadingStudentOptions: false,
        loadingStudentOptionsError: error
      })
      break

    case FETCH_INSTRUMENT_REQUEST:
      reducedState = reduceAction({
        loadingInstrument: true,
        instrument: {},
        loadingInstrumentError: null
      })
      break

    case FETCH_INSTRUMENT_SUCCESS:
      reducedState = reduceAction({
        loadingInstrument: false,
        instrument: payload
      })
      break

    case FETCH_INSTRUMENT_FAILURE:
      reducedState = reduceAction({
        loadingInstrument: false,
        loadingInstrumentError: error
      })
      break

    case SAVE_INSTRUMENT_REQUEST:
      reducedState = reduceAction({
        savingInstrument: true,
        savingInstrumentError: null
      })
      break

    case SAVE_INSTRUMENT_SUCCESS:
      reducedState = reduceAction({ ...defaultState })
      break

    case SAVE_INSTRUMENT_FAILURE:
      reducedState = reduceAction({
        savingInstrument: false,
        savingInstrumentError: error
      })
      break

    case HIDE_FORM_MODAL:
      reducedState = reduceAction({ ...defaultState })
      break

  }

  return reducedState
}