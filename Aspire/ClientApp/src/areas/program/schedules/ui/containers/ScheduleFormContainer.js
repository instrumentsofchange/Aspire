import { connect } from 'react-redux'
import { hideFormModal } from '../actions/schedule-form-ui-actions'
import {
  fetchSchedule,
  saveSchedule
} from '../../data/actions/schedule-form-data-actions'
import { fetchSchedules } from '../../data/actions/schedule-list-data-actions'
import ScheduleForm from '../components/ScheduleForm'

const mapStateToProps = (state, props) => {

  const {
    scheduleId,

    loadingSchedule,
    schedule,
    loadingScheduleError,

    savingSchedule,
    savingScheduleError
  } = state.schedules.data.form

  const {
    modalOpen
  } = state.schedules.ui.form

  const isCreate = scheduleId === 0
  const pageLoading = loadingSchedule
  const pageError = loadingScheduleError

  return {
    pageLoading,
    pageError,
    programId: props.programId,
    isCreate,
    isOpen: modalOpen,
    scheduleId,
    schedule,
    savingSchedule,
    savingScheduleError
  }
}

const mapDispatchToProps = dispatch => ({
  hideFormModal: () => dispatch(hideFormModal()),

  fetchSchedule: scheduleId => dispatch(fetchSchedule(scheduleId)),

  saveSchedule: schedule => {
    schedule.startDate = new Date(schedule.startDate)
    schedule.endDate = new Date(schedule.endDate)

    dispatch(saveSchedule(schedule))
      .then(() => {
        dispatch(hideFormModal())
        dispatch(fetchSchedules(schedule.programId))
      })
      .catch(error => console.error(error))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScheduleForm)