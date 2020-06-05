import { connect } from 'react-redux';
import {
  fetchMeetDays,
  fetchStudentList,
  saveAttendance
} from '../actions/check-in-actions';
import CheckInForm from '../components/CheckInForm';

const mapStateToProps = (state, props) => {

  return {
    userRole: state.users.authentication.role,
    programId: state.app.data.selectedProgram.id,
    ...state.checkIn
  }
}

const mapDispatchToProps = dispatch => ({
  fetchMeetDays: programId => dispatch(fetchMeetDays(programId)),
  fetchStudentList: (programId, meetDay) => dispatch(fetchStudentList(programId, meetDay)),
  saveAttendance: (students, programId, meetDay) => {
    dispatch(saveAttendance(students, programId, meetDay))
      .then(() => dispatch(fetchStudentList(programId, meetDay)))
      .catch(error => console.error(error))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckInForm);