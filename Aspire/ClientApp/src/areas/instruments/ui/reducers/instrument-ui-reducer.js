import {
  SHOW_DELETE_MODAL,
  HIDE_DELETE_MODAL,
  SHOW_FORM_MODAL,
  HIDE_FORM_MODAL
} from '../actions/instruments-ui-actions'

const defaultState = {
  deleteModalOpen: false,
  instrumentIdToDelete: null,
  formModalOpen: false,
  instrumentId: null
}

export default (state = defaultState, { type, payload, error }) => {
  let reducedState = { ...state }

  const reduceAction = changes => ({
    ...state,
    ...changes
  })

  switch(type) {
    case SHOW_DELETE_MODAL:
      reducedState = reduceAction({
        deleteModalOpen: true,
        instrumentIdToDelete: payload
      })
      break

    case HIDE_DELETE_MODAL:
      reducedState = reduceAction({
        deleteModalOpen: false,
        instrumentIdToDelete: null
      })
      break

    case SHOW_FORM_MODAL:
      reducedState = reduceAction({
        formModalOpen: true,
        instrumentId: payload
      })
      break

    case HIDE_FORM_MODAL:
      reducedState = reduceAction({
        formModalOpen: false,
        instrumentId: null
      })
  }

  return reducedState
}