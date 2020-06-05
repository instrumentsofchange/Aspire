import {
  FETCH_STUDENT_CONTACT_INFO_REQUEST,
  FETCH_STUDENT_CONTACT_INFO_SUCCESS,
  FETCH_STUDENT_CONTACT_INFO_FAILURE
} from '../actions/student-contact-info-data-actions'

import {
  SHOW_STUDENT_CONTACT_INFO_MODAL,
  HIDE_STUDENT_CONTACT_INFO_MODAL
} from '../../ui/actions/student-contact-info-ui-actions'

const defaultState = {
  loadingStudentInfo: true
}

export default (state = defaultState, { type, payload, error }) => {
  let reducedState = state

  const reduceAction = changes => ({
    ...state,
    ...changes
  })

  switch(type) {
    case FETCH_STUDENT_CONTACT_INFO_REQUEST:
      reducedState = reduceAction({
        loadingStudentInfo: true,
        loadingStudentInfoError: null
      })
      break

    case FETCH_STUDENT_CONTACT_INFO_SUCCESS:
      reducedState = reduceAction({
        loadingStudentInfo: false,
        studentInfo: payload
      })
      break

    case FETCH_STUDENT_CONTACT_INFO_FAILURE:
      reducedState = reduceAction({
        loadingStudentInfo: false,
        studentInfo: null,
        loadingStudentInfoError: error
      })
      break

    case SHOW_STUDENT_CONTACT_INFO_MODAL:
      reducedState = reduceAction({
        studentId: payload
      })
      break

    case HIDE_STUDENT_CONTACT_INFO_MODAL:
      reducedState = reduceAction({
        studentId: null
      })
      break
  }

  return reducedState
}