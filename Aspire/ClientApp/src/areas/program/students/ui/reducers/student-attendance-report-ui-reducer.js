import {
  SHOW_STUDENT_ATTENDANCE_FORM_MODAL,
  HIDE_STUDENT_ATTENDANCE_FORM_MODAL
} from '../actions/student-attendance-report-ui-actions'

const defaultState = {
  studentAttendanceFormModalOpen: false
}

export default (state = defaultState, { type }) => {
  let reducedState = { ...state }

  const reduceAction = changes => ({
    ...state,
    ...changes
  })

  switch(type) {
    case SHOW_STUDENT_ATTENDANCE_FORM_MODAL:
      reducedState = reduceAction({
        studentAttendanceFormModalOpen: true
      })
      break

    case HIDE_STUDENT_ATTENDANCE_FORM_MODAL:
      reducedState = reduceAction({
        studentAttendanceFormModalOpen: false
      })
      break
  }

  return reducedState
}