import Request from '../../shared/request/aspire-request';

export const FETCH_PROGRAM_OPTIONS_REQUEST = '@@aspire-app/FETCH_PROGRAM_OPTIONS_REQUEST_SIGN_UP';
export const FETCH_PROGRAM_OPTIONS_SUCCESS = '@@aspire-app/FETCH_PROGRAM_OPTIONS_SUCCESS_SIGN_UP';
export const FETCH_PROGRAM_OPTIONS_FAILURE = '@@aspire-app/FETCH_PROGRAM_OPTIONS_FAILURE_SIGN_UP';
export const fetchProgramOptions = () => dispatch => {
  dispatch({ type: FETCH_PROGRAM_OPTIONS_REQUEST });

  Request.get(
    '/api/programs/options',
    response => dispatch({
      type: FETCH_PROGRAM_OPTIONS_SUCCESS,
      payload: response
    }),
    ({ error: { message }}) => dispatch({
      type: FETCH_PROGRAM_OPTIONS_FAILURE,
      error: message
    })
  );
}

export const SAVE_STUDENT_REQUEST = '@@aspire-app/SAVE_STUDENT_REQUEST';
export const SAVE_STUDENT_SUCCESS = '@@aspire-app/SAVE_STUDENT_SUCCESS';
export const SAVE_STUDENT_FAILURE = '@@aspire-app/SAVE_STUDENT_FAILURE';
export const saveStudent = student => dispatch => {
  dispatch({ type: SAVE_STUDENT_REQUEST });

  Request.post(
    '/api/student/',
    student,
    () => dispatch({ type: SAVE_STUDENT_SUCCESS }),
    ({ error: { message }}) => dispatch({
      type: SAVE_STUDENT_FAILURE,
      error: message
    })
  );
}