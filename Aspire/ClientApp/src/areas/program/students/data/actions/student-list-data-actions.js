import Request from '../../../../shared/request/aspire-request'

const studentApiUrl = '/api/student'

export const FETCH_PROGRAM_OPTIONS_REQUEST = '@@aspire-app/FETCH_PROGRAM_OPTIONS_REQUEST'
export const FETCH_PROGRAM_OPTIONS_SUCCESS = '@@aspire-app/FETCH_PROGRAM_OPTIONS_SUCCESS'
export const FETCH_PROGRAM_OPTIONS_FAILURE = '@@aspire-app/FETCH_PROGRAM_OPTIONS_FAILURE'
export const fetchProgramOptions = () => dispatch => {

  dispatch({ type: FETCH_PROGRAM_OPTIONS_REQUEST })

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
  )
}

export const FETCH_STUDENT_LIST_REQUEST = '@@aspire-app/FETCH_STUDENT_LIST_REQUEST'
export const FETCH_STUDENT_LIST_SUCCESS = '@@aspire-app/FETCH_STUDENT_LIST_SUCCESS'
export const FETCH_STUDENT_LIST_FAILURE = '@@aspire-app/FETCH_STUDENT_LIST_FAILURE'
export const fetchStudents = program => dispatch => {

  dispatch({ type: FETCH_STUDENT_LIST_REQUEST })

  Request.get(
    `${studentApiUrl}/list/${program}`,
    response => dispatch({
      type: FETCH_STUDENT_LIST_SUCCESS,
      payload: response
    }),
    ({ error: { message }}) => dispatch({
      type: FETCH_STUDENT_LIST_FAILURE,
      error: message
    })
  )
}

export const FETCH_STUDENT_CONTACT_INFO_REQUEST = '@@aspire-app/FETCH_STUDENT_CONTACT_INFO_REQUEST'
export const FETCH_STUDENT_CONTACT_INFO_SUCCESS = '@@aspire-app/FETCH_STUDENT_CONTACT_INFO_SUCCESS'
export const FETCH_STUDENT_CONTACT_INFO_FAILURE = '@@aspire-app/FETCH_STUDENT_CONTACT_INFO_FAILURE'
export const fetchStudentContactInfo = studentId => dispatch => {

  dispatch({ type: FETCH_STUDENT_CONTACT_INFO_REQUEST })

  Request.get(
    `${studentApiUrl}/contact-info/${studentId}`,
    response => dispatch({
      type: FETCH_STUDENT_CONTACT_INFO_SUCCESS,
      payload: response
    }),
    ({ error: { message }}) => dispatch({
      type: FETCH_STUDENT_CONTACT_INFO_FAILURE,
      error: message
    })
  )
}