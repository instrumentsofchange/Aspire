import React, { Component } from 'react'
import { Row, Col, Label, Input } from 'reactstrap'
import { AutoSizer, Table, Column } from 'react-virtualized'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faTrash, faDownload } from '@fortawesome/free-solid-svg-icons'
import { isNil } from 'lodash'
import { Roles } from '../../../../shared/enums/RolesEnum'
import LoadingSpinner from '../../../../shared/components/LoadingSpinner'
import StudentInfoModal from '../containers/StudentInfoContainer'
import AspireModal from '../../../../shared/components/AspireModal'
import PrimaryButton from '../../../../shared/components/PrimaryButton'
import StudentAttendanceForm from '../containers/StudentAttendanceFormContainer'
import 'react-virtualized/styles.css'
import '../../../../../styles/table.scss'

export default class StudentList extends Component {

  componentDidMount() {
    const {
      programId,
      fetchStudents
    } = this.props

    fetchStudents(programId)
  }

  componentDidUpdate(prevProps) {
    const {
      programId,
      fetchStudents
    } = this.props

    if(prevProps.programId !== programId) {
      fetchStudents(programId)
    }
  }

  render() {
    const {
      loadingStudents,
      loadingStudentsError
    } = this.props

    let content 

    if(loadingStudents) {
      content = <LoadingSpinner />
    } else if(loadingStudentsError) {
      content = <h2>Error: {loadingStudentsError}</h2>
    } else {
      content = (
        <div className="mt-3">
          {this.renderAttendanceReportButton()}
          {this.renderAutoSizeTable()}
          {this.renderContactInfoModal()}
          {this.renderStudentAttendanceFormModal()}
        </div>
      )
    }

    return content
  }

  renderAttendanceReportButton = () => {
    const { showStudentAttendanceModal } = this.props

    return (
      <div className="mb-3">
        <PrimaryButton
          onClick={showStudentAttendanceModal}
          text="Download Attendance Report"
          icon={<FontAwesomeIcon icon={faDownload} />}
        />
      </div>
    )
  }

  renderAutoSizeTable = () => {
    const { students } = this.props

    return isNil(students) ? null : (
      <div className="aspire-table mt-3">
        <AutoSizer>
          {({ height, width }) => (
            <Table 
              headerHeight={40}
              height={height}
              width={width}
              rowCount={students.length}
              rowHeight={40}
              rowGetter={({ index }) => students[index]}
              noRowsRenderer={this.renderNoRows}
            >
              <Column
                label="First Name"
                key="First Name"
                dataKey="firstName"
                cellRenderer={this.renderFirstNameCell}
                width={200}
              />
              <Column
                label="Last Name"
                key="Last Name"
                dataKey="lastName"
                cellRenderer={this.renderLastNameCell}
                flexGrow={1}
                width={200}
              />
              <Column
                label=""
                key="actions"
                dataKey="id"
                cellRenderer={this.renderOptionsCell}
                width={250}
              />
            </Table>
          )}
        </AutoSizer>
      </div>
    )
  }

  renderFirstNameCell = ({ rowData: { firstName }}) => (
    <span>{firstName}</span>
  )

  renderLastNameCell = ({ rowData: { lastName } }) => (
    <span className="cell-wrap-text">
      <a>{lastName}</a>
    </span>
  )

  renderOptionsCell = ({ rowData: { id }}) => {
    const { showContactInfoModal } = this.props

    return (
      <span className="options-cell">

        <span
          className="option-icon"
          title="View Student Info"
          onClick={() => showContactInfoModal(id)}
        >
          <FontAwesomeIcon icon={faEye} />
        </span>

        <span
          className="option-icon"
          title="View Student Info"
          onClick={() => console.log('Delete Student: ', id)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </span>

      </span>

    )
  }

  renderNoRows = () => (
    <div className="no-rows">No Students Found</div>
  )

  renderContactInfoModal = () => {
    const {
      studentContactModalOpen,
      hideStudentContactModal
    } = this.props

    return (
      <AspireModal
        isOpen={studentContactModalOpen}
        onClose={hideStudentContactModal}
        content={<StudentInfoModal />}
        title="Student Info"
        size="lg"
      /> 
    )
  }

  renderStudentAttendanceFormModal = () => {
    const {
      studentAttendanceFormModalOpen,
      hideStudentAttendanceModal
    } = this.props

    return (
      <AspireModal
        isOpen={studentAttendanceFormModalOpen}
        onClose={hideStudentAttendanceModal}
        content={<StudentAttendanceForm />}
        title="Download Attendance Report"
      />
    )
  }
}