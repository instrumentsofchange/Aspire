import {
  FETCH_PROGRAM_OPTIONS_REQUEST,
  FETCH_PROGRAM_OPTIONS_SUCCESS,
  FETCH_PROGRAM_OPTIONS_FAILURE,
  SEARCH_SCHEDULES_REQUEST,
  SEARCH_SCHEDULES_SUCCESS,
  SEARCH_SCHEDULES_FAILURE,
  DELETE_SCHEDULE_REQUEST,
  DELETE_SCHEDULE_SUCCESS,
  DELETE_SCHEDULE_FAILURE
} from '../actions/search-schedule-data-actions';

const defaultState = {
  programOptionsLoading: true
};

export default (state = defaultState, { type, payload, error }) => {

  let reducedState = state;

  const reduceAction = changes => ({
    ...state,
    ...changes
  });

  switch(type) {
    case FETCH_PROGRAM_OPTIONS_REQUEST:
      reducedState = reduceAction({ programOptionsLoading: true });
      break;

    case FETCH_PROGRAM_OPTIONS_SUCCESS:
      reducedState = reduceAction({ 
        programOptionsLoading: false,
        programOptions: payload
      });
      break;

    case FETCH_PROGRAM_OPTIONS_FAILURE:
      reducedState = reduceAction({
        programOptionsLoading: false,
        fetchProgramOptionsError: error
      });
      break;

    case SEARCH_SCHEDULES_REQUEST:
      reducedState = reduceAction({ 
        searchResultsLoading: true,
        scheduleDeleted: false
      });
      break;

    case SEARCH_SCHEDULES_SUCCESS:
      reducedState = reduceAction({
        searchResultsLoading: false,
        searchResults: payload
      });
      break;

    case SEARCH_SCHEDULES_FAILURE:
      reducedState = reduceAction({
        searchResultsLoading: false,
        searchSchedulesError: error
      });
      break;

    case DELETE_SCHEDULE_REQUEST:
      reducedState = reduceAction({ deletingSchedule: true });
      break;

    case DELETE_SCHEDULE_SUCCESS:
      reducedState = reduceAction({
        deletingSchedule: false,
        scheduleDeleted: true
      });
      break;

    case DELETE_SCHEDULE_FAILURE:
      reducedState = reduceAction({
        deletingSchedule: false,
        deletingScheduleError: error
      });
      break;
  }

  return reducedState;
}