import { connect } from 'react-redux'
import { fetchStudentInfo } from '../../data/actions/student-contact-info-data-actions'
import { hideContactInfoModal } from '../actions/student-contact-info-ui-actions'
import StudentInfo from '../components/StudentInfo'

const mapStateToProps = state => {

  const {
    studentId,
    loadingStudentInfo,
    studentInfo,
    loadingStudentInfoError
  } = state.students.data.info

  return {
    studentId,
    loadingStudentInfo,
    studentInfo,
    loadingStudentInfoError
  }
}

const mapDispatchToProps = {
  hideContactInfoModal,
  fetchStudentInfo
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentInfo)