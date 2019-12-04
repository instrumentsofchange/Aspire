import Request from '../../shared/request/aspire-request';
import { isNil } from 'lodash';

const schedulesApiUrl = '/api/schedules';

export const FETCH_PROGRAM_OPTIONS_REQUEST = '@@aspire-app/FETCH_PROGRAM_OPTIONS_REQUEST_SCHEDULE_FORM';
export const FETCH_PROGRAM_OPTIONS_SUCCESS = '@@aspire-app/FETCH_PROGRAM_OPTIONS_SUCCESS_SCHEDULE_FORM';
export const FETCH_PROGRAM_OPTIONS_FAILURE = '@@aspire-app/FETCH_PROGRAM_OPTIONS_FAILURE_SCHEDULE_FORM';
export const fetchProgramOptions = () => dispatch => {
  dispatch({ type: FETCH_PROGRAM_OPTIONS_REQUEST });

  Request.get(
    '/api/programs/options',
    response => dispatch({
      type: FETCH_PROGRAM_OPTIONS_SUCCESS,
      payload: response
    }),
    ({ error: { message }}) =>  dispatch({
        type: FETCH_PROGRAM_OPTIONS_FAILURE,
        error: message
    })
  );
}

export const SAVE_SCHEDULE_REQUEST = '@@aspire-app/SAVE_SCHEDULE_REQUEST';
export const SAVE_SCHEDULE_SUCCESS = '@@aspire-app/SAVE_SCHEDULE_SUCCESS';
export const SAVE_SCHEDULE_FAILURE = '@@aspire-app/SAVE_SCHEDULE_FAILURE';
export const saveSchedule = schedule => dispatch => {
  dispatch({ type: SAVE_SCHEDULE_REQUEST });

  const saveSuccess = () => dispatch({ type: SAVE_SCHEDULE_SUCCESS });

  const saveFailure = ({ error: { message }}) => dispatch({
    type: SAVE_SCHEDULE_FAILURE,
    error: message
  });
  
  if(isNil(schedule.id)) {
    schedule.id = 0;

    Request.post(
      schedulesApiUrl,
      schedule,
      saveSuccess,
      saveFailure
    );
  } else {
    Request.put(
      schedulesApiUrl,
      schedule,
      saveSuccess,
      saveFailure
    );
  }
}

export const FETCH_SCHEDULE_TO_EDIT_REQUEST = '@@aspire-app/FETCH_SCHEDULE_TO_EDIT_REQUEST';
export const FETCH_SCHEDULE_TO_EDIT_SUCCESS = '@@aspire-app/FETCH_SCHEDULE_TO_EDIT_SUCCESS';
export const FETCH_SCHEDULE_TO_EDIT_FAILURE = '@@aspire-app/FETCH_SCHEDULE_TO_EDIT_FAILURE';
export const fetchSchedule = scheduleId => dispatch => {
  dispatch({ type: FETCH_SCHEDULE_TO_EDIT_REQUEST });

  Request.get(
    `${schedulesApiUrl}/${scheduleId}`,
    response => {
      response.startDate = new Date(response.startDate).toISOString().split('T')[0];
      response.endDate = new Date(response.endDate).toISOString().split('T')[0];
     
      dispatch({
        type: FETCH_SCHEDULE_TO_EDIT_SUCCESS,
        payload: response
      })
    },
    ({ error: { message }}) => {
      dispatch({
      type: FETCH_SCHEDULE_TO_EDIT_FAILURE,
      error: message
    })}
  );
}