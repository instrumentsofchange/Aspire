import Request from '../../../../shared/request/aspire-request'
import { get } from 'lodash'

const studentApiUrl = '/api/student'

export const FETCH_STUDENT_CONTACT_INFO_REQUEST = '@@aspire-app/FETCH_STUDENT_CONTACT_INFO_REQUEST'
export const FETCH_STUDENT_CONTACT_INFO_SUCCESS = '@@aspire-app/FETCH_STUDENT_CONTACT_INFO_SUCCESS'
export const FETCH_STUDENT_CONTACT_INFO_FAILURE = '@@aspire-app/FETCH_STUDENT_CONTACT_INFO_FAILURE'
export const fetchStudentInfo = studentId => dispatch => {

  dispatch({ type: FETCH_STUDENT_CONTACT_INFO_REQUEST })

  Request.get(
    `${studentApiUrl}/contact-info/${studentId}`,
    response => dispatch({
      type: FETCH_STUDENT_CONTACT_INFO_SUCCESS,
      payload: response
    }),
    errorResponse => {
      const errorMessage = get(errorResponse, 'errorResponse.error.message', 'There was a problem fetching the student\'s contact info')

      dispatch({
        type: FETCH_STUDENT_CONTACT_INFO_FAILURE,
        error: errorMessage
      })
    }
  )
}