import React, { Component } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { isNil } from 'lodash'
import { Alert, Button, Container, Row, Col, Label, Input, Table } from 'reactstrap'
import { Roles } from '../../../shared/enums/RolesEnum'
import LoadingSpinner from '../../../shared/components/LoadingSpinner'
import ErrorRow from '../../../shared/components/ErrorRow'
import { AttendanceStatus } from '../../../shared/enums/index'
import { AutoSizer, Grid } from 'react-virtualized'
import 'react-virtualized/styles.css'
import PrimaryButton from '../../../shared/components/PrimaryButton'
// import '../../../../styles/table.scss'

const CheckInSchema = Yup.object().shape({
  students: Yup.array().of(Yup.object().shape({
    status: Yup.string().required('Please select a status')
  }))
});

export default class CheckInForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      meetDay: 'Select One...'
    };
  }

  componentDidMount() {
    const { 
      programId,
      fetchMeetDays
    } = this.props;

    fetchMeetDays(programId)
  }

  componentDidUpdate(prevProps) {
    if (this.props.programId !== prevProps.programId) {
      this.props.fetchMeetDays(this.props.programId)
    }
  }

  handleMeetDayChange = ({ target: { value }}) => {
    const { 
      fetchStudentList,
      programId
    } = this.props

    this.setState({ meetDay: value }, fetchStudentList(programId, value))
  }

  meetDayIsSelected = () => this.state.meetDay !== 'Select One...'

  redirectToHome = () => window.location = '';

  render() {
    const {
      savingAttendance,
      loadingMeetDayOptions
    } = this.props;

    let content;

    if(savingAttendance || loadingMeetDayOptions) {
      content = <LoadingSpinner text="Saving Attendance" />;
    } 
    // else if(attendanceSaved) {
    //   setTimeout(() => this.redirectToHome(), 2000);

    //   content = <LoadingSpinner color="success" text="Attendance Saved!" />;
    // } 
    else {
      content = (
        <div className="mt-3">
          {this.renderMeetDaySelect()}
          {this.renderCheckInForm()}
        </div>
      );
    }
    return content;
  }

  renderMeetDaySelect = () => {
    const { 
      meetDay
    } = this.state
    const {
      meetDayOptions,
      loadingMeetDaysError
    } = this.props

    let content = null

    if(loadingMeetDaysError) {
      content = (
        <Alert color="danger">
          There was a problem loading the meet day options.
          <br />
          Details:
          <pre>{JSON.stringify(loadingMeetDaysError, null, 2)}</pre>
        </Alert>
      )
    } else if (meetDayOptions) {
      content = (
        <Row className="mt-2">
          <Col sm={1}>
            <Label for="meetDay">Meet Day:</Label>
          </Col>
          <Col sm={3}>
            <Input
              type="select"
              onChange={this.handleMeetDayChange}
              value={meetDay}
            >
              <option disabled>Select One...</option>
              {
                meetDayOptions.map(option => (
                  <option key={option.value} value={option.value} disabled={option.disabled}>{option.text}</option>
                ))
              }
            </Input>
          </Col>
        </Row>
      )
    }

    return content;
  }

  renderCheckInForm = () => {
    const { meetDay } = this.state
    const { 
      studentListLoading,
      studentList,
      loadingStudentListError,
      saveAttendance,
      savingAttendance,
      savingAttendanceError,
      programId
    } = this.props

    let content

    if(studentListLoading) { 
      content = <LoadingSpinner text="Loading Students..." />
    } else if(loadingStudentListError || savingAttendanceError) {
      content = (
        <ErrorRow
          className="mt-3"
          error={loadingStudentListError || savingAttendanceError}
        />
        // <Alert className="mt-3" color="danger">
        //   There was a problem loading the students.
        //   <br/>
        //   Details:
        //   <pre>{JSON.stringify(loadingStudentListError, null, 2)}</pre>
        // </Alert>
      )
    } else if(studentList.length > 0 && this.meetDayIsSelected()) {
      content = (
        <Row className="mt-3">
          <Col md={8}>
            <Formik
              initialValues={{ students: studentList }}
              validationSchema={CheckInSchema}
              validate={this.validate}
              onSubmit={values => saveAttendance(values.students, programId, meetDay)}
            >
              {({ values, touched, errors, setFieldValue, handleSubmit }) => (
                <div>
                  <Table striped bordered>
                    <thead>
                      <tr>
                        <th className="text-center">Student Name</th>
                        <th className="text-center">Present</th>
                        <th className="text-center">Excused</th>
                        <th className="text-center">Unexcused</th>
                        <th className="text-center">School Business</th>
                        <th className="text-center">ISS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        studentList.map((student, index) => (
                          <tr key={index}>
                            <th className="text-right" scope="row">
                              {student.firstName} {student.lastName}
                              <br />
                              {
                                errors.students && touched.students && errors.students[index] &&
                                <div key={index} className="invalid-feedback" style={{ 'display': 'block' }}>{errors.students[index].status}</div>
                              }
                            </th>
                            <th className="text-center">
                              <Input
                                type="radio"
                                checked={values.students[index].status === AttendanceStatus.PRESENT}
                                onChange={() => setFieldValue(`students[${index}].status`, AttendanceStatus.PRESENT)}
                              />
                            </th>
                            <th className="text-center">
                              <Input
                                type="radio"
                                checked={values.students[index].status === AttendanceStatus.EXCUSED}
                                onChange={() => setFieldValue(`students[${index}].status`, AttendanceStatus.EXCUSED)}
                              />
                            </th>
                            <th className="text-center">
                              <Input
                                type="radio"
                                checked={values.students[index].status === AttendanceStatus.UNEXCUSED}
                                onChange={() => setFieldValue(`students[${index}].status`, AttendanceStatus.UNEXCUSED)}
                              />
                            </th>
                            <th className="text-center">
                              <Input
                                type="radio"
                                checked={values.students[index].status === AttendanceStatus.SCHOOL_BUSINESS}
                                onChange={() => setFieldValue(`students[${index}].status`, AttendanceStatus.SCHOOL_BUSINESS)}
                              />
                            </th>
                            <th className="text-center">
                              <Input
                                type="radio"
                                checked={values.students[index].status === AttendanceStatus.ISS}
                                onChange={() => setFieldValue(`students[${index}].status`, AttendanceStatus.ISS)}
                              />
                            </th>
                          </tr>
                        ))
                      }
                    </tbody>
                  </Table>
                  
                  {!savingAttendance && <PrimaryButton onClick={handleSubmit} text="Save" />}
                
                  {savingAttendance && <LoadingSpinner size={40} text="Saving..." noCenter />}
                </div>
              )}
            </Formik>
          </Col>
        </Row>
      )
    }

    return content
  }
}