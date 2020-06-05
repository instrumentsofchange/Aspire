export const SHOW_DELETE_MODAL = '@@aspire-instruments/SHOW_DELETE_MODAL'
export const HIDE_DELETE_MODAL = '@@aspire-instruments/HIDE_DELETE_MODAL'
export const showDeleteModal = instrumentIdToDelete => ({
  type: SHOW_DELETE_MODAL, 
  payload: instrumentIdToDelete 
})
export const hideDeleteModal = () => ({ type: HIDE_DELETE_MODAL })

export const SHOW_FORM_MODAL = '@@aspire-instruments/SHOW_FORM_MODAL'
export const HIDE_FORM_MODAL = '@@aspire-instruments/HIDE_FORM_MODAL'
export const showFormModal = (instrumentId) => ({ 
  type: SHOW_FORM_MODAL, 
  payload: instrumentId
})
export const hideFormModal = () => ({ type: HIDE_FORM_MODAL })