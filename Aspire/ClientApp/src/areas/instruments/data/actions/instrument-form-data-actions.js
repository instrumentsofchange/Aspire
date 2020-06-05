import { isNil } from 'lodash'
import superagent from 'superagent'
import Request from '../../../shared/request/aspire-request'
import { tryGetErrorFromApiResponse } from '../../../shared/Tools'

const instrumentsApiRoute = '/api/instruments'

export const FETCH_INSTRUMENT_FORM_CONSTANTS_REQUEST = '@@aspire-instruments/FETCH_INSTRUMENT_FORM_CONSTANTS_REQUEST'
export const FETCH_INSTRUMENT_FORM_CONSTANTS_SUCCESS = '@@aspire-instruments/FETCH_INSTRUMENT_FORM_CONSTANTS_SUCCESS'
export const FETCH_INSTRUMENT_FORM_CONSTANTS_FAILURE = '@@aspire-instruments/FETCH_INSTRUMENT_FORM_CONSTANTS_FAILURE'
export const fetchFormConstants = () => dispatch => {

  dispatch({ type: FETCH_INSTRUMENT_FORM_CONSTANTS_REQUEST })

  return Request.get(
    `${instrumentsApiRoute}/form-constants`,
    response => dispatch({
      type: FETCH_INSTRUMENT_FORM_CONSTANTS_SUCCESS,
      payload: response
    }),
    error => {
      const errorMessage = tryGetErrorFromApiResponse(error, 'There was a problem loading the Instrument')

      dispatch({
        type: FETCH_INSTRUMENT_FORM_CONSTANTS_FAILURE,
        error: errorMessage
      })
      
      throw errorMessage
    }
  )
}

export const FETCH_INSTRUMENT_REQUEST = '@@aspire-instruments/FETCH_INSTRUMENT_REQUEST'
export const FETCH_INSTRUMENT_SUCCESS = '@@aspire-instruments/FETCH_INSTRUMENT_SUCCESS'
export const FETCH_INSTRUMENT_FAILURE = '@@aspire-instruments/FETCH_INSTRUMENT_FAILURE'
export const fetchInstrument = instrumentId => dispatch => {

  dispatch({ type: FETCH_INSTRUMENT_REQUEST })

  const url = isNil(instrumentId) ? `${instrumentsApiRoute}/default` : `${instrumentsApiRoute}/${instrumentId}`

  return Request.get(
    url,
    response => {
      dispatch({
        type: FETCH_INSTRUMENT_SUCCESS,
        payload: response
      })

      return response
    },
    error => {
      const errorMessage = tryGetErrorFromApiResponse(error, 'There was a problem fetching the Instrument')
      
      dispatch({
        type: FETCH_INSTRUMENT_FAILURE,
        error: errorMessage
      })
    
      throw errorMessage
    }
  )
}

export const FETCH_MODEL_OPTIONS_REQUEST = '@@aspire-instruments/FETCH_MODEL_OPTIONS_REQUEST'
export const FETCH_MODEL_OPTIONS_SUCCESS = '@@aspire-instruments/FETCH_MODEL_OPTIONS_SUCCESS'
export const FETCH_MODEL_OPTIONS_FAILURE = '@@aspire-instruments/FETCH_MODEL_OPTIONS_FAILURE'
export const fetchModelOptions = makeId => dispatch => {

  dispatch({ type: FETCH_MODEL_OPTIONS_REQUEST })

  return Request.get(
    `${instrumentsApiRoute}/model/options?makeId=${makeId}`,
    response => dispatch({
      type: FETCH_MODEL_OPTIONS_SUCCESS,
      payload: response
    }),
    error => {
      const errorMessage = tryGetErrorFromApiResponse(error, 'There was a problem loading the Model options')

      dispatch({
        type: FETCH_MODEL_OPTIONS_FAILURE,
        error: errorMessage
      })

      throw errorMessage
    }
  )
}

export const FETCH_STUDENT_OPTIONS_REQUEST = '@@aspire-instruments/FETCH_STUDENT_OPTIONS_REQUEST'
export const FETCH_STUDENT_OPTIONS_SUCCESS = '@@aspire-instruments/FETCH_STUDENT_OPTIONS_SUCCESS'
export const FETCH_STUDENT_OPTIONS_FAILURE = '@@aspire-instruments/FETCH_STUDENT_OPTIONS_FAILURE'
export const fetchStudentOptions = programId => dispatch => {

  dispatch({ type: FETCH_STUDENT_OPTIONS_REQUEST })

  Request.get(
    `/api/student/options?programId=${programId}`,
    response => dispatch({
      type: FETCH_STUDENT_OPTIONS_SUCCESS,
      payload: response
    }),
    ({ error: { message } }) => dispatch({
      type: FETCH_STUDENT_OPTIONS_FAILURE,
      error: message
    })
  )
}

export const SAVE_INSTRUMENT_REQUEST = '@@aspire-instruments/SAVE_INSTRUMENT_REQUEST'
export const SAVE_INSTRUMENT_SUCCESS = '@@aspire-instruments/SAVE_INSTRUMENT_SUCCESS'
export const SAVE_INSTRUMENT_FAILURE = '@@aspire-instruments/SAVE_INSTRUMENT_FAILURE'
export const saveInstrument = instrument => dispatch => {

  dispatch({ type: SAVE_INSTRUMENT_REQUEST })

  if (isNil(instrument.id)) {
    return Request.post(
      instrumentsApiRoute,
      instrument,
      () => dispatch({ type: SAVE_INSTRUMENT_SUCCESS }),
      error => {
        const errorMessage = tryGetErrorFromApiResponse(error, 'There was a problem saving the Instrument')

        dispatch({
          type: SAVE_INSTRUMENT_FAILURE,
          error: errorMessage
        })

        throw errorMessage
      }
    )
  } else {
    return Request.put(
      instrumentsApiRoute,
      instrument,
      () => dispatch({ type: SAVE_INSTRUMENT_SUCCESS }),
      error => {
        const errorMessage = tryGetErrorFromApiResponse(error, 'There was a problem saving the Instrument')

        dispatch({
          type: SAVE_INSTRUMENT_FAILURE,
          error: errorMessage
        })

        throw errorMessage
      }
    )
  }
}