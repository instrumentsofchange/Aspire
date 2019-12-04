import Request from '../../shared/request/aspire-request';

const schedulesApiUrl = '/api/schedules';

export const FETCH_PROGRAM_OPTIONS_REQUEST = '@@aspire-app/FETCH_PROGRAM_OPTIONS_REQUEST_SEARCH_SCHEDULE';
export const FETCH_PROGRAM_OPTIONS_SUCCESS = '@@aspire-app/FETCH_PROGRAM_OPTIONS_SUCCESS_SEARCH_SCHEDULE';
export const FETCH_PROGRAM_OPTIONS_FAILURE = '@@aspire-app/FETCH_PROGRAM_OPTIONS_FAILURE_SEARCH_SCHEDULE';
export const fetchProgramOptions = () => dispatch => {
  dispatch({ type: FETCH_PROGRAM_OPTIONS_REQUEST });

  Request.get(
    '/api/programs/options',
    response => dispatch({
      type: FETCH_PROGRAM_OPTIONS_SUCCESS,
      payload: response
    }),
    ({error: { message }}) => dispatch({
      type: FETCH_PROGRAM_OPTIONS_FAILURE,
      error: message
    })
  );
}

export const SEARCH_SCHEDULES_REQUEST = '@@variphy-app/SEARCH_SCHEDULES_REQUEST';
export const SEARCH_SCHEDULES_SUCCESS = '@@variphy-app/SEARCH_SCHEDULES_SUCCESS';
export const SEARCH_SCHEDULES_FAILURE = '@@variphy-app/SEARCH_SCHEDULES_FAILURE';
export const searchSchedules = searchValues => dispatch => {
  dispatch({ type: SEARCH_SCHEDULES_REQUEST });

  Request.get(
    `${schedulesApiUrl}/search?program=${searchValues.program}`,
    response => dispatch({
      type: SEARCH_SCHEDULES_SUCCESS,
      payload: response
    }),
    ({ error: { message}}) => dispatch({
      type: SEARCH_SCHEDULES_FAILURE,
      error: message
    })
  )
}

export const DELETE_SCHEDULE_REQUEST = '@@aspire-app/DELETE_SCHEDULE_REQUEST';
export const DELETE_SCHEDULE_SUCCESS = '@@aspire-app/DELETE_SCHEDULE_SUCCESS';
export const DELETE_SCHEDULE_FAILURE = '@@aspire-app/DELETE_SCHEDULE_FAILURE';
export const deleteSchedule = scheduleId => dispatch => {
  dispatch({ type: DELETE_SCHEDULE_REQUEST });

  Request.delete(
    `${schedulesApiUrl}/${scheduleId}`,
    () => dispatch({ type: DELETE_SCHEDULE_SUCCESS }),
    ({ error: { message }}) => dispatch({
      type: DELETE_SCHEDULE_FAILURE,
      error: message
    })
  );
}