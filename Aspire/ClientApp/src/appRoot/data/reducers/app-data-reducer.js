import { isNil } from 'lodash'
import {
  APP_INITIALIZATION_REQUEST,
  APP_INITIALIZATION_SUCCESS,
  APP_INITIALIZATION_FAILURE,
  FETCH_PROGRAM_OPTIONS_REQUEST,
  FETCH_PROGRAM_OPTIONS_SUCCESS,
  FETCH_PROGRAM_OPTIONS_FAILURE,
  CHANGE_PROGRAM_SELECTION
} from '../actions/app-data-actions';

import {
  GET_PROFILE_REQUEST,
  GET_PROFILE_FAILURE
} from '../../../areas/users/actions/authentication-actions'

const defaultState = {
  isInitializing: true,
  selectedProgram: {
    name: '',
    id: null
  }
}

export default (state = defaultState, { type, payload, error }) => {

  let reducedState = { ...state }

  const reduceAction = changes => ({
    ...state,
    ...changes
  })

  const getDefaultProgram = programs => {
    const defaultProgram = programs.find(program => !program.disabled)

    return {
      name: defaultProgram.text,
      id: defaultProgram.value
    }
  }

  switch (type) {
    case APP_INITIALIZATION_REQUEST:
    case GET_PROFILE_REQUEST:
      reducedState = reduceAction({
        isInitializing: true
      })
      break

    case APP_INITIALIZATION_SUCCESS:
      reducedState = reduceAction({
        isInitializing: false
      })
      break

    case APP_INITIALIZATION_FAILURE:
    case GET_PROFILE_FAILURE:
      reducedState = reduceAction({
        isInitializing: false,
        error: error
      })
      break

    case FETCH_PROGRAM_OPTIONS_REQUEST:
      reducedState = reduceAction({
        loadingProgramOptions: true,
        programOptions: null,
        loadingProgramOptionsError: null
      })
      break

    case FETCH_PROGRAM_OPTIONS_SUCCESS:
      const selectedProgram = isNil(state.selectedProgram.id) 
        ? getDefaultProgram(payload)
        : state.selectedProgram

      reducedState = reduceAction({
        loadingProgramOptions: false,
        programOptions: payload,
        selectedProgram
      })
      break

    case FETCH_PROGRAM_OPTIONS_FAILURE:
     reducedState = reduceAction({
       loadingProgramOptions: false,
       loadingProgramOptionsError: error
      })
      break

    case CHANGE_PROGRAM_SELECTION:
      reducedState = reduceAction({
        selectedProgram: payload
      })
      break
  }

  return reducedState
}