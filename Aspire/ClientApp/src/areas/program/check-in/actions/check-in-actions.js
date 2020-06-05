import Request from '../../../shared/request/aspire-request'

const schedulesApiUrl = '/api/program/schedules';

export const FETCH_MEET_DAYS_REQUEST = '@@aspire-app/FETCH_MEET_DAYS_REQUEST';
export const FETCH_MEET_DAYS_SUCCESS = '@@aspire-app/FETCH_MEET_DAYS_SUCCESS';
export const FETCH_MEET_DAYS_FAILURE = '@@aspire-app/FETCH_MEET_DAYS_FAILURE';
export const fetchMeetDays = programId => dispatch => {
  console.log(programId)
  dispatch({ type: FETCH_MEET_DAYS_REQUEST });

  Request.get(
    `${schedulesApiUrl}/meet-days/${programId}/options`,
    response => dispatch({
      type: FETCH_MEET_DAYS_SUCCESS,
      payload: response
    }),
    ({ error: { message }}) => dispatch({
      type: FETCH_MEET_DAYS_FAILURE,
      error: message
    })
  );
}

export const FETCH_STUDENT_LIST_REQUEST = '@@aspire-app/FETCH_STUDENT_LIST_REQUEST';
export const FETCH_STUDENT_LIST_SUCCESS = '@@aspire-app/FETCH_STUDENT_LIST_SUCCESS';
export const FETCH_STUDENT_LIST_FAILURE = '@@aspire-app/FETCH_STUDENT_LIST_FAILURE';
export const fetchStudentList = (program, meetDay) => dispatch => {
  dispatch({ type: FETCH_STUDENT_LIST_REQUEST });
  
  Request.get(
    `${schedulesApiUrl}/attendance/${program}?meetDay=${meetDay}`,
    response => dispatch({
      type: FETCH_STUDENT_LIST_SUCCESS,
      payload: response
    }),
    ({ error: { message }}) => dispatch({
      type: FETCH_STUDENT_LIST_FAILURE,
      error: message
    })
  );
}

export const SAVE_ATTENDANCE_REQUEST = '@@aspire-app/SAVE_ATTENDANCE_REQUEST';
export const SAVE_ATTENDANCE_SUCCESS = '@@aspire-app/SAVE_ATTENDANCE_SUCCESS';
export const SAVE_ATTENDANCE_FAILURE = '@@aspire-app/SAVE_ATTENDANCE_FAILURE';
export const saveAttendance = (students, programId, meetDay) => dispatch => {

  dispatch({ type: SAVE_ATTENDANCE_REQUEST })

  const body = { 
    students,
    programId: parseInt(programId),
    meetDay: new Date(meetDay).toJSON()
  };

  return Request.post(
    `${schedulesApiUrl}/attendance`,
    body,
    () => dispatch({ type: SAVE_ATTENDANCE_SUCCESS }),
    ({ error: { message }}) => {
      dispatch({
        type: SAVE_ATTENDANCE_FAILURE,
        error: message
      })
    
      throw message
    }
  );
}