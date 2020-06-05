export const SHOW_STUDENT_CONTACT_INFO_MODAL = '@@aspire-app/SHOW_STUDENT_CONTACT_INFO_MODAL'
export const HIDE_STUDENT_CONTACT_INFO_MODAL = '@@aspire-app/HIDE_STUDENT_CONTACT_INFO_MODAL'
export const showContactInfoModal = studentId => ({
  type: SHOW_STUDENT_CONTACT_INFO_MODAL,
  payload: studentId
})
export const hideContactInfoModal = () => ({ type: HIDE_STUDENT_CONTACT_INFO_MODAL })