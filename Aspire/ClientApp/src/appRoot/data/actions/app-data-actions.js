import Request from '../../../areas/shared/request/aspire-request'

export const APP_INITIALIZATION_REQUEST = '@@aspire-app/APP_INITIALIZATION_REQUEST';
export const APP_INITIALIZATION_SUCCESS = '@@aspire-app/APP_INITIALIZATION_SUCCESS';
export const APP_INITIALIZATION_FAILURE = '@@aspire-app/APP_INITIALIZATION_FAILURE';
export const initializeApp = () => dispatch => {
  dispatch({ type: APP_INITIALIZATION_REQUEST })
  dispatch(fetchProgramOptions())
}

export const FETCH_PROGRAM_OPTIONS_REQUEST = '@@aspire-app-data/FETCH_PROGRAM_OPTIONS_REQUEST'
export const FETCH_PROGRAM_OPTIONS_SUCCESS = '@@aspire-app-data/FETCH_PROGRAM_OPTIONS_SUCCESS'
export const FETCH_PROGRAM_OPTIONS_FAILURE = '@@aspire-app-data/FETCH_PROGRAM_OPTIONS_FAILURE'
export const fetchProgramOptions = () => dispatch => {

  dispatch({ type: FETCH_PROGRAM_OPTIONS_REQUEST })
  
  Request.get(
    '/api/programs/options',
    response => dispatch({
      type: FETCH_PROGRAM_OPTIONS_SUCCESS,
      payload: response
    }),
    error => dispatch({
      type: FETCH_PROGRAM_OPTIONS_FAILURE,
      error: error
    })
  )
}

export const CHANGE_PROGRAM_SELECTION = '@@aspire-app-data/CHANGE_PROGRAM_SELECTION'
export const changeProgramSelection = program => ({ 
  type: CHANGE_PROGRAM_SELECTION,
  payload: program
})