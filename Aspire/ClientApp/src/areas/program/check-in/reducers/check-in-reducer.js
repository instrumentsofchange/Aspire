import {
  FETCH_MEET_DAYS_REQUEST,
  FETCH_MEET_DAYS_SUCCESS,
  FETCH_MEET_DAYS_FAILURE,
  FETCH_STUDENT_LIST_REQUEST,
  FETCH_STUDENT_LIST_SUCCESS,
  FETCH_STUDENT_LIST_FAILURE,
  SAVE_ATTENDANCE_REQUEST,
  SAVE_ATTENDANCE_SUCCESS,
  SAVE_ATTENDANCE_FAILURE
} from '../actions/check-in-actions'

const defaultState = {
  loadingMeetDays: false,
  meetDayOptions: [],
  loadingMeetDaysError: null,
  loadingStudentList: false,
  studentList: [],
  loadingStudentListError: null,
  savingAttendance: false,
  attendanceSaved: false
}

export default (state = defaultState, { type, payload, error }) => {
  let reducedState = state

  const reduceAction = changes => ({
    ...state,
    ...changes
  })

  switch(type) {
    case FETCH_MEET_DAYS_REQUEST:
      reducedState = reduceAction({ 
        loadingMeetDays: true,
        meetDayOptions: []
      })
      break

    case FETCH_MEET_DAYS_SUCCESS:
      reducedState = reduceAction({
        loadingMeetDays: false,
        meetDayOptions: payload
      })
      break

    case FETCH_MEET_DAYS_FAILURE:
      reducedState = reduceAction({
        loadingMeetDays: false,
        loadingMeetDaysError: error
      })
      break

    case FETCH_STUDENT_LIST_REQUEST:
      reducedState = reduceAction({
        loadingStudentList: true,
        studentList: []
      })
      break

    case FETCH_STUDENT_LIST_SUCCESS:
      reducedState = reduceAction({
        loadingStudentList: false,
        studentList: payload
      })
      break
    
    case FETCH_STUDENT_LIST_FAILURE:
      reducedState = reduceAction({
        loadingStudentList: false,
        loadingStudentListError: error
      })
      break

    case SAVE_ATTENDANCE_REQUEST:
      reducedState = reduceAction({ 
        savingAttendance: true,
        attendanceSaved: false
      })
      break

    case SAVE_ATTENDANCE_SUCCESS:
      reducedState = reduceAction({ 
        savingAttendance: false,
        attendanceSaved: true 
      })
      break

    case SAVE_ATTENDANCE_FAILURE:
      reducedState = reduceAction({ 
        savingAttendance: false,
        savingAttendanceError: error
      })
      break
  }

  return reducedState
}