import { connect } from 'react-redux'
import { 
  fetchProgramOptions,
  fetchStudents
} from '../../data/actions/student-list-data-actions'
import {
  showContactInfoModal,
  hideContactInfoModal
} from '../actions/student-contact-info-ui-actions'
import {
  showStudentAttendanceModal,
  hideStudentAttendanceModal
} from '../actions/student-attendance-report-ui-actions'
import StudentList from '../components/StudentList'

const mapStateToProps = state => {

  const {
    role, 
    program
  } = state.users.authentication;

  const { id } = state.app.data.selectedProgram

  const {
    loadingProgramOptions,
    programOptions,
    loadingProgramOptionsError,

    loadingStudents,
    students,
    loadingStudentsError
  } = state.students.data.list

  const {
    contactInfo: {
      studentContactModalOpen
    },
    attendanceReport: {
      studentAttendanceFormModalOpen
    }
  } = state.students.ui

  return {
    userRole: role,
    userProgram: program,
    programId: id,

    loadingProgramOptions,
    programOptions,
    loadingProgramOptionsError,

    loadingStudents,
    students,
    loadingStudentsError,

    studentContactModalOpen,
    studentAttendanceFormModalOpen
  }
}

const mapDispatchToProps = {
  fetchProgramOptions,
  fetchStudents,
  showContactInfoModal,
  hideContactInfoModal,
  showStudentAttendanceModal,
  hideStudentAttendanceModal
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentList)