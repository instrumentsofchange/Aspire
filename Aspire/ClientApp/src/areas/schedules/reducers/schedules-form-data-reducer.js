import {
  FETCH_PROGRAM_OPTIONS_REQUEST,
  FETCH_PROGRAM_OPTIONS_SUCCESS,
  FETCH_PROGRAM_OPTIONS_FAILURE,
  SAVE_SCHEDULE_REQUEST,
  SAVE_SCHEDULE_SUCCESS,
  SAVE_SCHEDULE_FAILURE,
  FETCH_SCHEDULE_TO_EDIT_REQUEST,
  FETCH_SCHEDULE_TO_EDIT_SUCCESS,
  FETCH_SCHEDULE_TO_EDIT_FAILURE
} from '../actions/schedules-form-data-actions';

const defaultState = {
  programOptionsLoading: true
};

export default (state = defaultState, action) => {
  const { type, payload, error } = action;

  let reducedState = { ...state };

  const reduceAction = changes => ({
    ...state, 
    ...changes
  })

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

    case SAVE_SCHEDULE_REQUEST:
      reducedState = reduceAction({ savingSchedule: true });
      break;

    case SAVE_SCHEDULE_SUCCESS:
      reducedState = reduceAction({ 
        savingSchedule: false,
        scheduleSaved: true
      });
      break;

    case SAVE_SCHEDULE_FAILURE:
      reducedState = reduceAction({
        savingSchedule: false,
        savingScheduleError: error
      });
      break;

    case FETCH_SCHEDULE_TO_EDIT_REQUEST:
      reducedState = reduceAction({ scheduleLoading: true });
      break;

    case FETCH_SCHEDULE_TO_EDIT_SUCCESS:
      reducedState = reduceAction({
        scheduleLoading: false,
        schedule: payload
      });
      break;

    case FETCH_SCHEDULE_TO_EDIT_FAILURE:
      reducedState = reduceAction({
        scheduleLoading: false,
        fetchScheduleError: error
      });
      break;
  }
 
  return reducedState;
}