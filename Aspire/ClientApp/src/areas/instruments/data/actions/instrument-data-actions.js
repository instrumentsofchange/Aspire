import Request from '../../../shared/request/aspire-request'
import { tryGetErrorFromApiResponse } from '../../../shared/Tools'

const instrumentsApiRoute = '/api/instruments'

export const FETCH_INSTRUMENT_LIST_CONSTANTS_REQUEST = '@@aspire-instruments/FETCH_INSTRUMENT_LIST_CONSTANTS_REQUEST'
export const FETCH_INSTRUMENT_LIST_CONSTANTS_SUCCESS = '@@aspire-instruments/FETCH_INSTRUMENT_LIST_CONSTANTS_SUCCESS'
export const FETCH_INSTRUMENT_LIST_CONSTANTS_FAILURE = '@@aspire-instruments/FETCH_INSTRUMENT_LIST_CONSTANTS_FAILURE'
export const fetchInstrumentConstants = () => dispatch => {
  
  dispatch({ type: FETCH_INSTRUMENT_LIST_CONSTANTS_REQUEST })

  return Request.get(
    `${instrumentsApiRoute}/constants`,
    response => dispatch({
      type: FETCH_INSTRUMENT_LIST_CONSTANTS_SUCCESS,
      payload: response
    }),
    (error) => dispatch({
      type: FETCH_INSTRUMENT_LIST_CONSTANTS_FAILURE,
      error: tryGetErrorFromApiResponse(error, 'There was a problem loading the Instruments')
    })
  )
}

export const FETCH_INSTRUMENT_LIST_REQUEST = '@@aspire-instruments/FETCH_INSTRUMENT_LIST_REQUEST'
export const FETCH_INSTRUMENT_LIST_SUCCESS = '@@aspire-instruments/FETCH_INSTRUMENT_LIST_SUCCESS'
export const FETCH_INSTRUMENT_LIST_FAILURE = '@@aspire-instruments/FETCH_INSTRUMENT_LIST_FAILURE'
export const fetchInstrumentList = ({ status, program }) => dispatch => {

  dispatch({ type: FETCH_INSTRUMENT_LIST_REQUEST })

  Request.get(
    `${instrumentsApiRoute}?status=${status}&programId=${program}`,
    response => dispatch({
      type: FETCH_INSTRUMENT_LIST_SUCCESS,
      payload: response
    }),
    error => dispatch({
      type: FETCH_INSTRUMENT_LIST_FAILURE,
      error: tryGetErrorFromApiResponse(error, 'There was problem fetching the Instrument List')
    })
  )
}

export const DELETE_INSTRUMENT_REQUEST = '@@aspire-instruments/DELETE_INSTRUMENT_REQUEST'
export const DELETE_INSTRUMENT_SUCCESS = '@@aspire-instruments/DELETE_INSTRUMENT_SUCCESS'
export const DELETE_INSTRUMENT_FAILURE = '@@aspire-instruments/DELETE_INSTRUMENT_FAILURE'
export const deleteInstrument = instrumentId => dispatch => {

  dispatch({ type: DELETE_INSTRUMENT_REQUEST })

  return Request.delete(
    `${instrumentsApiRoute}/${instrumentId}`,
    () => { },
    error => {
      const errorMessage = tryGetErrorFromApiResponse(error, 'There was a problem deleting the Instrument')

      dispatch({
        type: DELETE_INSTRUMENT_FAILURE,
        error: errorMessage
      })
      
      throw errorMessage
    }
  )
}