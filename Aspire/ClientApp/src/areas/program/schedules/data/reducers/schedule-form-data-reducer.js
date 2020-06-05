import {
  POPULATE_SCHEDULE_FORM_DATA,
  FETCH_SCHEDULE_REQUEST,
  FETCH_SCHEDULE_SUCCESS,
  FETCH_SCHEDULE_FAILURE,
  SAVE_SCHEDULE_REQUEST,
  SAVE_SCHEDULE_SUCCESS,
  SAVE_SCHEDULE_FAILURE
} from '../actions/schedule-form-data-actions'
import { HIDE_SCHEDULE_FORM_MODAL } from '../../ui/actions/schedule-form-ui-actions'

const defaultState = {
  scheduleId: null,

  loadingSchedule: false,
  schedule: null,
  loadingScheduleError: null,

  savingSchedule: false,
  savingScheduleError: null
}

export default (state = defaultState, { type, payload, error }) => {
  let reducedState = { ...state }

  const reduceAction = changes => ({
    ...state,
    ...changes
  })

  switch(type) {
    case POPULATE_SCHEDULE_FORM_DATA:
      reducedState = reduceAction({
        scheduleId: payload
      })
      break

    case FETCH_SCHEDULE_REQUEST:
      reducedState = reduceAction({
        loadingSchedule: true,
        schedule: null,
        loadingScheduleError: null
      })
      break

    case FETCH_SCHEDULE_SUCCESS:
      reducedState = reduceAction({
        loadingSchedule: false,
        schedule: payload
      })
      break

    case FETCH_SCHEDULE_FAILURE:
      reducedState = reduceAction({
        loadingSchedule: false,
        schedule: null,
        loadingScheduleError: error
      })
      break

    case SAVE_SCHEDULE_REQUEST:
      reducedState = reduceAction({
        savingSchedule: true,
        savingScheduleError: null
      })
      break

    case SAVE_SCHEDULE_SUCCESS:
      reducedState = reduceAction({
        savingSchedule: false
      })
      break

    case SAVE_SCHEDULE_FAILURE:
      reducedState = reduceAction({
        savingSchedule: false,
        savingScheduleError: error
      })
      break

    case HIDE_SCHEDULE_FORM_MODAL:
      reducedState = reduceAction({
        savingScheduleError: null
      })
  }

  return reducedState
}