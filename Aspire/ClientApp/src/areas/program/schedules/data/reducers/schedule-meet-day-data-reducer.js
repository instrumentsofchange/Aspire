import {
  FETCH_MEET_DAY_OPTIONS_REQUEST,
  FETCH_MEET_DAY_OPTIONS_SUCCESS,
  FETCH_MEET_DAY_OPTIONS_FAILURE,
  POPULATE_MEET_DAY_DATA,
  MODIFY_MEET_DAY_REQUEST,
  MODIFY_MEET_DAY_SUCCESS,
  MODIFY_MEET_DAY_FAILURE
} from '../actions/schedule-meet-day-data-actions'

import { HIDE_MEET_DAY_MODAL } from '../../ui/actions/schedule-meet-day-ui-actions'

const defaultState = {
  loadingMeetDayOptions: true,
  meetDayOptions: [],
  loadingMeetDayOptionsError: null,
  scheduleId: null,
  modifyingMeetDay: false,
  modifyingMeetDayError: null
}

export default (state = defaultState, { type, payload, error }) => {
  let reducedState = { ...state }

  const reduceAction = changes => ({
    ...state,
    ...changes
  })

  switch(type) {
    case FETCH_MEET_DAY_OPTIONS_REQUEST:
      reducedState = reduceAction({
        loadingMeetDayOptions: true,
        meetDayOptions: [],
        loadingMeetDayOptionsError: null
      })
      break

    case FETCH_MEET_DAY_OPTIONS_SUCCESS:
      reducedState = reduceAction({
        loadingMeetDayOptions: false,
        meetDayOptions: payload
      })
      break
    
    case FETCH_MEET_DAY_OPTIONS_FAILURE: 
      reducedState = reduceAction({
        loadingMeetDayOptions: false,
        meetDayOptions: [],
        loadingMeetDayOptionsError: error
      })
      break

    case POPULATE_MEET_DAY_DATA:
      reducedState = reduceAction({
        scheduleId: payload
      })
      break

    case MODIFY_MEET_DAY_REQUEST:
      reducedState = reduceAction({
        modifyingMeetDay: true,
        modifyingMeetDayError: null
      })
      break

    case MODIFY_MEET_DAY_SUCCESS:
      reducedState = reduceAction({
        modifyingMeetDay: false
      })
      break

    case MODIFY_MEET_DAY_FAILURE:
      reducedState = reduceAction({
        modifyingMeetDay: false,
        modifyingMeetDayError: error
      })
      break

    case HIDE_MEET_DAY_MODAL:
      reducedState = reduceAction(defaultState)
      break
  }

  return reducedState
}