import Request from '../../../../shared/request/aspire-request'
import { isNil } from 'lodash'

const programSchedulesApiUrl = '/api/program/schedules'


export const POPULATE_SCHEDULE_FORM_DATA = '@@aspire-app/POPULATE_SCHEDULE_FORM_DATA'
export const populateScheduleFormData = scheduleId => ({
  type: POPULATE_SCHEDULE_FORM_DATA,
  payload: scheduleId
})

export const FETCH_SCHEDULE_REQUEST = '@@aspire-app/FETCH_SCHEDULE_REQUEST'
export const FETCH_SCHEDULE_SUCCESS = '@@aspire-app/FETCH_SCHEDULE_SUCCESS'
export const FETCH_SCHEDULE_FAILURE = '@@aspire-app/FETCH_SCHEDULE_FAILURE'
export const fetchSchedule = scheduleId => dispatch => {
  
  dispatch({ type: FETCH_SCHEDULE_REQUEST })

  Request.get(
    `${programSchedulesApiUrl}/${scheduleId}`,
    response => dispatch({
      type: FETCH_SCHEDULE_SUCCESS,
      payload: response
    }),
    ({ error: { message }}) => dispatch({
      type: FETCH_SCHEDULE_FAILURE,
      error: message
    })
  )
}

export const SAVE_SCHEDULE_REQUEST = '@@aspire-app/SAVE_SCHEDULE_REQUEST'
export const SAVE_SCHEDULE_SUCCESS = '@@aspire-app/SAVE_SCHEDULE_SUCCESS'
export const SAVE_SCHEDULE_FAILURE = '@@aspire-app/SAVE_SCHEDULE_FAILURE'
export const saveSchedule = schedule => dispatch => {
debugger;
  dispatch({ type: SAVE_SCHEDULE_REQUEST })

  const onSuccess = () => dispatch({ type: SAVE_SCHEDULE_SUCCESS })
  const onFailure = ({ error: { message }}) => {
    dispatch({
      type: SAVE_SCHEDULE_FAILURE,
      error: message
    })

    throw message
  }

  if(isNil(schedule.id) || schedule.id === 0) {
    return Request.post(
      programSchedulesApiUrl,
      schedule,
      onSuccess,
      onFailure
    )
  } else {
    return Request.put(
      programSchedulesApiUrl,
      schedule,
      onSuccess,
      onFailure
    )
  }
}