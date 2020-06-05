export const SHOW_DELETE_MODAL = '@@aspire-program-schedules/SHOW_DELETE_MODAL'
export const HIDE_DELETE_MODAL = '@@aspire-program-schedules/HIDE_DELETE_MODAL'
export const showDeleteModal = scheduleId => ({ type: SHOW_DELETE_MODAL, payload: scheduleId })
export const hideDeleteModal = () => ({ type: HIDE_DELETE_MODAL })