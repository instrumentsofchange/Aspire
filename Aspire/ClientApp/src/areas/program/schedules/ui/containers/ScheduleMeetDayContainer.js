import { connect } from 'react-redux'
import { isNil } from 'lodash'
import ScheduleMeetDay from '../components/ScheduleMeetDay'
import { hideMeetDayModal } from '../actions/schedule-meet-day-ui-actions'
import { fetchMeetDayOptions, modifyMeetDay } from '../../data/actions/schedule-meet-day-data-actions'
import { fetchSchedules } from '../../data/actions/schedule-list-data-actions'

const mapStateToProps = state => {

  const {
    modalOpen
  } = state.schedules.ui.meetDay

  const {
    loadingMeetDayOptions,
    meetDayOptions,
    loadingMeetDayOptionsError,
    scheduleId,
    modifyingMeetDay,
    modifyingMeetDayError
  } = state.schedules.data.meetDay

  const programId = state.app.data.selectedProgram.id

  const pageLoading = loadingMeetDayOptions
  const pageError = loadingMeetDayOptionsError

  return {
    programId,
    modalOpen,
    pageLoading,
    pageError,
    scheduleId,
    meetDayOptions,
    modifyingMeetDay,
    modifyingMeetDayError
  }
}

const mapDispatchToProps = dispatch => ({

  hideMeetDayModal: () => dispatch(hideMeetDayModal()),

  fetchMeetDayOptions: scheduleId => dispatch(fetchMeetDayOptions(scheduleId)),
  
  modifyMeetDay: (scheduleId, request, programId) => {
    const newMeetDate = request.newMeetDate === '' ? new Date() : new Date(request.newMeetDate)
    request.newMeetDate = newMeetDate.toISOString().split('T')[0]
    request.meetDate = new Date(request.meetDate).toISOString().split('T')[0]

    dispatch(modifyMeetDay(scheduleId, request))
      .then(() => {
        dispatch(hideMeetDayModal())
        dispatch(fetchSchedules(programId))
      })
      .catch(error => console.error(error))
  }

})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScheduleMeetDay)