import {
  SHOW_MEET_DAY_MODAL,
  HIDE_MEET_DAY_MODAL
} from '../actions/schedule-meet-day-ui-actions'

const defaultState = {
  modalOpen: false
}

export default (state = defaultState, { type }) => {
  let reducedState = { ...state }

  switch(type) {
    case SHOW_MEET_DAY_MODAL:
      reducedState = {
        ...state,
        modalOpen: true
      }
      break

    case HIDE_MEET_DAY_MODAL:
      reducedState = {
        ...state,
        modalOpen: false
      }
      break
  }

  return reducedState
}