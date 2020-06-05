import { connect } from 'react-redux'
import ScheduleList from '../components/ScheduleList'
import { fetchProgramOptions, fetchSchedules, deleteSchedule } from '../../data/actions/schedule-list-data-actions'
import { populateScheduleFormData } from '../../data/actions/schedule-form-data-actions'
import { showDeleteModal, hideDeleteModal } from '../actions/schedule-list-ui-actions'
import { showFormModal } from '../actions/schedule-form-ui-actions'
import { showMeetDayModal } from '../actions/schedule-meet-day-ui-actions'
import { populateMeetDayData } from '../../data/actions/schedule-meet-day-data-actions'

const mapStateToProps = state => {

  const { id } = state.app.data.selectedProgram

  const {
    loadingProgramOptions,
    programOptions,
    loadingProgramOptionsError,

    loadingSchedules,
    schedules,
    loadingSchedulesError,

    deletingSchedule,
    deletingScheduleError
  } = state.schedules.data.list

  const scheduleFormModalOpen = state.schedules.ui.form.modalOpen
  const scheduleMeetDayModalOpen = state.schedules.ui.meetDay.modalOpen

  const {
    scheduleIdToDelete,
    deleteModalOpen
  } = state.schedules.ui.list

  const pageLoading = loadingProgramOptions || loadingSchedules

  const pageError = loadingProgramOptionsError || loadingSchedulesError

  return {
    programId: id,
    pageLoading,
    pageError,
    programOptions,
    schedules,
    scheduleFormModalOpen,
    scheduleMeetDayModalOpen,
    scheduleIdToDelete,
    deleteModalOpen,
    deletingSchedule,
    deletingScheduleError
  }
}

const mapDispatchToProps = dispatch => ({

  fetchProgramOptions: () => dispatch(fetchProgramOptions()),

  fetchSchedules: programId => dispatch(fetchSchedules(programId)),

  showFormModal: scheduleId => {
    dispatch(populateScheduleFormData(scheduleId))
    dispatch(showFormModal())
  },

  showMeetDayModal: scheduleId => {
    dispatch(populateMeetDayData(scheduleId))
    dispatch(showMeetDayModal())
  },

  showDeleteModal: scheduleId => dispatch(showDeleteModal(scheduleId)),

  hideDeleteModal: () => dispatch(hideDeleteModal()),

  deleteSchedule: (scheduleId, programId) => {
    dispatch(deleteSchedule(scheduleId))
      .then(() => {
        dispatch(hideDeleteModal())
        dispatch(fetchSchedules(programId))
      })
      .catch(error => console.error(error))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScheduleList)