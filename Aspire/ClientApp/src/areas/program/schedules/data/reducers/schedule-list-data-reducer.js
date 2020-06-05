import {
  FETCH_PROGRAM_OPTIONS_REQUEST,
  FETCH_PROGRAM_OPTIONS_SUCCESS,
  FETCH_PROGRAM_OPTIONS_FAILURE,
  FETCH_SCHEDULES_REQUEST,
  FETCH_SCHEDULES_SUCCESS,
  FETCH_SCHEDULES_FAILURE,
  DELETE_SCHEDULE_REQUEST,
  DELETE_SCHEDULE_SUCCESS,
  DELETE_SCHEDULE_FAILURE
} from '../actions/schedule-list-data-actions'

const defaultState = {
  programOptions: [],
  loadingProgramOptions: false,
  loadingProgramOptionsError: null,

  schedules: [],
  loadingSchedules: false,
  loadingSchedulesError: null
}

export default (state = defaultState, { type, payload, error }) => {
  let reducedState = { ...state }

  const reduceAction = changes => ({
    ...state,
    ...changes
  })

  switch (type) {
    case FETCH_PROGRAM_OPTIONS_REQUEST:
      reducedState = reduceAction({
        loadingProgramOptions: true,
        programOptions: [],
        loadingProgramOptionsError: null
      })
      break

    case FETCH_PROGRAM_OPTIONS_SUCCESS:
      reducedState = reduceAction({
        loadingProgramOptions: false,
        programOptions: payload
      })
      break

    case FETCH_PROGRAM_OPTIONS_FAILURE:
      reducedState = reduceAction({
        loadingProgramOptions: false,
        programOptions: [],
        loadingProgramOptionsError: error
      })
      break

    case FETCH_SCHEDULES_REQUEST:
      reducedState = reduceAction({
        loadingSchedules: true,
        schedules: [],
        loadingSchedulesError: null
      })
      break

    case FETCH_SCHEDULES_SUCCESS:
      reducedState = reduceAction({
        loadingSchedules: false,
        schedules: payload
      })
      break

    case FETCH_SCHEDULES_FAILURE:
      reducedState = reduceAction({
        loadingSchedules: false,
        schedules: [],
        loadingSchedulesError: error
      })
      break

    case DELETE_SCHEDULE_REQUEST:
      reducedState = reduceAction({
        deletingSchedule: true,
        deletingScheduleError: null
      })
      break

    case DELETE_SCHEDULE_SUCCESS:
      reducedState = reduceAction({
        deletingSchedule: false
      })
      break

    case DELETE_SCHEDULE_FAILURE:
      reducedState = reduceAction({
        deletingSchedule: false,
        deletingScheduleError: error
      })
      break
  }

  return reducedState
}