import React, { Component } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Form, FormGroup, Label, Col, Input, CustomInput, FormFeedback } from 'reactstrap'
import PrimaryButton from '../../../../shared/components/PrimaryButton'

const attendanceReportSchema = Yup.object().shape({
  getFullAttendanceReport: Yup.boolean(),
  startDate: Yup.date().when('getFullAttendanceReport', {
    is: false,
    then: Yup.date().required('Required')
  }),
  endDate: Yup.date().when('getFullAttendanceReport', {
    is: false,
    then: Yup.date().required('Required')
  })
})

export default class StudentAttendanceForm extends Component {

  handleSubmit = values => this.props.fetchReport(values)

  render() {
    const { 
      fetchReport,
      programId 
    } = this.props

    return(
      <Formik
        initialValues={{
          getFullAttendanceReport: false,
          startDate: '',
          endDate: ''
        }}
        validationSchema={attendanceReportSchema}
        onSubmit={values => fetchReport(values, programId)}
      >
        {({ values, errors, touched, handleSubmit, handleChange, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Col sm={10}>
                <CustomInput 
                  type="checkbox"
                  id="getFullAttendanceReport"
                  label="Get Full Attendance Report?"
                  onChange={({ target: { checked } }) => {
                    if (checked) {
                      setFieldValue('startDate', '')
                      setFieldValue('endDate', '')
                    }

                    setFieldValue('getFullAttendanceReport', checked)
                  }}
                  checked={values.getFullAttendanceReport}
                />
                {
                  errors.getFullAttendanceReport && touched.getFullAttendanceReport
                  ? <FormFeedback>{errors.getFullAttendanceReport}</FormFeedback>
                  : null
                }
              </Col>
            </FormGroup>

            {!values.getFullAttendanceReport &&
              <FormGroup>
                <Col md={6}>
                  <Label for="startDate">Start Date</Label>
                  <Input 
                    type="date" 
                    name="startDate" 
                    max={values.endDate}
                    onChange={handleChange} 
                    value={values.startDate}
                    invalid={errors.startDate && touched.startDate}
                  />
                  {
                    errors.startDate && touched.startDate
                    ? <FormFeedback>{errors.startDate}</FormFeedback>
                      : null
                  }
                </Col>
                <Col md={6}>
                  <Label for="endDate">End Date</Label>
                  <Input 
                    type="date" 
                    name="endDate" 
                    min={values.startDate}
                    onChange={handleChange} 
                    value={values.endDate}
                    invalid={errors.endDate && touched.endDate}
                  />
                  {
                    errors.endDate && touched.endDate
                      ? <FormFeedback>{errors.endDate}</FormFeedback>
                      : null
                  }
                </Col>
              </FormGroup>
            }

            <Col md={{ size: 4, offset: 8 }}>
              <PrimaryButton text="Get Report" type="submit" />
            </Col>
        
          </Form>
        )}
      </Formik>
    )
  }
}