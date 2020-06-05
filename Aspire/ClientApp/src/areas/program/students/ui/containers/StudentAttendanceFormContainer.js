import { connect } from 'react-redux'
import { fetchAttendanceReport } from '../../data/actions/student-attendance-report-data-actions'
import { hideStudentAttendanceModal } from '../actions/student-attendance-report-ui-actions'
import StudentAttendanceForm from '../components/StudentAttendanceForm'

const mapStateToProps = state => {
   
  return {
    programId: state.app.data.selectedProgram.id
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  fetchReport: (values, programId) => {
    const startDate = values.getFullAttendanceReport ? null : values.startDate
    const endDate = values.getFullAttendanceReport ? null : values.endDate
    dispatch(fetchAttendanceReport(programId, startDate, endDate))
      .then(() => dispatch(hideStudentAttendanceModal()))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentAttendanceForm)