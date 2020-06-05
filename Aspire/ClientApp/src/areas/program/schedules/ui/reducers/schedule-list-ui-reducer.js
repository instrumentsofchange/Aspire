import {
  SHOW_DELETE_MODAL,
  HIDE_DELETE_MODAL
} from '../actions/schedule-list-ui-actions'

const defaultState = {
  deleteModalOpen: false,
  scheduleIdToDelete: null
}

export default (state = defaultState, { type, payload }) => {
  let reducedState = { ...state }

  const reduceAction = changes => ({
    ...state,
    ...changes
  })

  switch(type) {
    case SHOW_DELETE_MODAL:
      reducedState = reduceAction({
        scheduleIdToDelete: payload,
        deleteModalOpen: true
      })
      break

    case HIDE_DELETE_MODAL:
      reducedState = reduceAction({
        deleteModalOpen: false,
        scheduleIdToDelete: null
      })
      break
  }

  return reducedState
}