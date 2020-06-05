import Request from '../../../../shared/request/aspire-request'

const scheduleApiUrl = '/api/program/schedules'

export const FETCH_MEET_DAY_OPTIONS_REQUEST = '@@aspire-app/FETCH_MEET_DAY_OPTIONS_REQUEST'
export const FETCH_MEET_DAY_OPTIONS_SUCCESS = '@@aspire-app/FETCH_MEET_DAY_OPTIONS_SUCCESS'
export const FETCH_MEET_DAY_OPTIONS_FAILURE = '@@aspire-app/FETCH_MEET_DAY_OPTIONS_FAILURE'
export const fetchMeetDayOptions = scheduleId => dispatch => {

  dispatch({ type: FETCH_MEET_DAY_OPTIONS_REQUEST })

  Request.get(
    `${scheduleApiUrl}/meet-days/${scheduleId}/options`,
    response => dispatch({
      type: FETCH_MEET_DAY_OPTIONS_SUCCESS,
      payload: response
    }),
    ({ error: { message }}) => dispatch({
      type: FETCH_MEET_DAY_OPTIONS_FAILURE,
      error: message
    })
  )
}

export const POPULATE_MEET_DAY_DATA = '@@aspire-app/POPULATE_MEET_DAY_DATA'
export const populateMeetDayData = scheduleId => ({ 
  type: POPULATE_MEET_DAY_DATA,
  payload: scheduleId
})

export const MODIFY_MEET_DAY_REQUEST = '@@aspire-schedule-meet-day/MODIFY_MEET_DAY_REQUEST'
export const MODIFY_MEET_DAY_SUCCESS = '@@aspire-schedule-meet-day/MODIFY_MEET_DAY_SUCCESS'
export const MODIFY_MEET_DAY_FAILURE = '@@aspire-schedule-meet-day/MODIFY_MEET_DAY_FAILURE'
export const modifyMeetDay = (scheduleId, request) => dispatch => {
  debugger;

  dispatch({ type: MODIFY_MEET_DAY_REQUEST })

  return Request.put(
    `${scheduleApiUrl}/meet-day/${scheduleId}`,
    request,
    () => dispatch({ type: MODIFY_MEET_DAY_SUCCESS }),
    ({ error: { message }}) => {
      dispatch({
        type: MODIFY_MEET_DAY_FAILURE,
        error: message || 'There was a problem modifying the meet day'
      })
      
      throw message
    }
  )
}