import {
  SHOW_SCHEDULE_FORM_MODAL,
  HIDE_SCHEDULE_FORM_MODAL
} from '../actions/schedule-form-ui-actions'

const defaultState = {
  modalOpen: false
}

export default (state = defaultState, { type }) => {
  let reducedState = { ...state }

  const reduceAction = changes => ({
    ...state,
    ...changes
  })

  switch(type) {
    case SHOW_SCHEDULE_FORM_MODAL:
      reducedState = reduceAction({ modalOpen: true })
      break

    case HIDE_SCHEDULE_FORM_MODAL:
      reducedState = reduceAction({ modalOpen: false })
      break
  }

  return reducedState
}