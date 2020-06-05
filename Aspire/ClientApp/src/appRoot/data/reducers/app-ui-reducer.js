import {
  SHOW_SIMPLE_PROGRAM_CHANGE_MODAL,
  HIDE_SIMPLE_PROGRAM_CHANGE_MODAL
} from '../actions/app-ui-actions'

const defaultState = {
  programChangeModalOpen: false
}

export default (state = defaultState, { type }) => {
  let reducedState = { ...state }
  
  const reduceAction = changes => ({
    ...state,
    ...changes
  })

  switch(type) {
    case SHOW_SIMPLE_PROGRAM_CHANGE_MODAL:
      reducedState = reduceAction({
        programChangeModalOpen: true
      })
      break

    case HIDE_SIMPLE_PROGRAM_CHANGE_MODAL:
      reducedState = reduceAction({
        programChangeModalOpen: false
      })
      break
  }

  return reducedState
}