import {
  SHOW_STUDENT_CONTACT_INFO_MODAL,
  HIDE_STUDENT_CONTACT_INFO_MODAL
} from '../actions/student-contact-info-ui-actions'

const defaultState = {
  studentContactModalOpen: false
}

export default (state = defaultState, { type, payload, error }) => {
  let reducedState = state

  const reduceAction = changes => ({
    ...state,
    ...changes
  })

  switch(type) {
    case SHOW_STUDENT_CONTACT_INFO_MODAL:
      reducedState = reduceAction({
        studentContactModalOpen: true
      })
      break

    case HIDE_STUDENT_CONTACT_INFO_MODAL:
      reducedState = reduceAction({
        studentContactModalOpen: false
      })
      break
  }

  return reducedState
}