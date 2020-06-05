import {
  FETCH_PROGRAM_OPTIONS_REQUEST,
  FETCH_PROGRAM_OPTIONS_SUCCESS,
  FETCH_PROGRAM_OPTIONS_FAILURE,
  SAVE_STUDENT_REQUEST,
  SAVE_STUDENT_SUCCESS,
  SAVE_STUDENT_FAILURE
} from '../actions/sign-up-actions';

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

    case SAVE_STUDENT_REQUEST:
      reducedState = reduceAction({ savingStudent: true });
      break;

    case SAVE_STUDENT_SUCCESS:
      reducedState = reduceAction({ 
        savingStudent: false,
        studentSave: true
      });
      break;

    case SAVE_STUDENT_FAILURE:
      reducedState = reduceAction({
        savingStudent: false,
        savingStudentError: error
      });
      break;
  }

  return reducedState;
}