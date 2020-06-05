import {
  FETCH_PROGRAM_OPTIONS_REQUEST,
  FETCH_PROGRAM_OPTIONS_SUCCESS,
  FETCH_PROGRAM_OPTIONS_FAILURE,
  FETCH_STUDENT_LIST_REQUEST,
  FETCH_STUDENT_LIST_SUCCESS,
  FETCH_STUDENT_LIST_FAILURE
} from '../actions/student-list-data-actions'

const defaultState = {
  loadingProgramOptions: true
}

export default (state = defaultState, { type, payload, error }) => {
  let reducedState = state

  const reduceAction = changes => ({
    ...state,
    ...changes
  });

  switch(type) {
    case FETCH_PROGRAM_OPTIONS_REQUEST:
      reducedState = reduceAction({
        loadingProgramOptions: true,
        programOptions: null,
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
        programOptions: null,
        loadingProgramOptionsError: error
      })
      break

    case FETCH_STUDENT_LIST_REQUEST:
      reducedState = reduceAction({ 
        loadingStudents: true,
        students: null,
        loadingStudentsError: null
      })
      break

    case FETCH_STUDENT_LIST_SUCCESS:
      reducedState = reduceAction({
        loadingStudents: false,
        students: payload
      })
      break

    case FETCH_STUDENT_LIST_FAILURE:
      reducedState = reduceAction({
        loadingStudents: false,
        students: null,
        loadingStudentsError: error
      })
      break
  }

  return reducedState
}