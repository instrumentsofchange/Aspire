import Request from '../../../../shared/request/aspire-request';

const schedulesApiUrl = '/api/program/schedules';

export const FETCH_PROGRAM_OPTIONS_REQUEST = '@@aspire-program-schedules/FETCH_PROGRAM_OPTIONS_REQUEST_SEARCH_SCHEDULE';
export const FETCH_PROGRAM_OPTIONS_SUCCESS = '@@aspire-program-schedules/FETCH_PROGRAM_OPTIONS_SUCCESS_SEARCH_SCHEDULE';
export const FETCH_PROGRAM_OPTIONS_FAILURE = '@@aspire-program-schedules/FETCH_PROGRAM_OPTIONS_FAILURE_SEARCH_SCHEDULE';
export const fetchProgramOptions = () => dispatch => {

  dispatch({ type: FETCH_PROGRAM_OPTIONS_REQUEST })

  Request.get(
    '/api/programs/options',
    response => dispatch({
      type: FETCH_PROGRAM_OPTIONS_SUCCESS,
      payload: response
    }),
    ({ error: { message } }) => dispatch({
      type: FETCH_PROGRAM_OPTIONS_FAILURE,
      error: message
    })
  )
}

export const FETCH_SCHEDULES_REQUEST = '@@aspire-program-schedules/FETCH_SCHEDULES_REQUEST';
export const FETCH_SCHEDULES_SUCCESS = '@@aspire-program-schedules/FETCH_SCHEDULES_SUCCESS';
export const FETCH_SCHEDULES_FAILURE = '@@aspire-program-schedules/FETCH_SCHEDULES_FAILURE';
export const fetchSchedules = programId => dispatch => {

  dispatch({ type: FETCH_SCHEDULES_REQUEST });

  Request.get(
    `/api/program/${programId}/schedule/list`,
    response => dispatch({
      type: FETCH_SCHEDULES_SUCCESS,
      payload: response
    }),
    ({ error: { message } }) => dispatch({
      type: FETCH_SCHEDULES_FAILURE,
      error: message
    })
  )
}

export const DELETE_SCHEDULE_REQUEST = '@@aspire-program-schedules/DELETE_SCHEDULE_REQUEST'
export const DELETE_SCHEDULE_SUCCESS = '@@aspire-program-schedules/DELETE_SCHEDULE_SUCCESS'
export const DELETE_SCHEDULE_FAILURE = '@@aspire-program-schedules/DELETE_SCHEDULE_FAILURE'
export const deleteSchedule = scheduleId => dispatch => {

  dispatch({ type: DELETE_SCHEDULE_REQUEST })

  return Request.delete(
    `${schedulesApiUrl}/${scheduleId}`,
    () => dispatch({ type: DELETE_SCHEDULE_SUCCESS }),
    ({ error: { message }}) => {
      dispatch({
        type: DELETE_SCHEDULE_FAILURE,
        error: message
      })

      throw message
    }
  )
}