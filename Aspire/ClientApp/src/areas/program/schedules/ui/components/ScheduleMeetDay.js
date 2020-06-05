import React, { Component } from 'react'
import * as Yup from 'yup'
import AspireModal from '../../../../shared/components/AspireModal'
import { Formik } from 'formik'
import { Form, Row, Col, FormGroup, Label, Input, FormFeedback } from 'reactstrap'
import LoadingSpinner from '../../../../shared/components/LoadingSpinner'
import PrimaryButton from '../../../../shared/components/PrimaryButton'
import './styles/schedule-meet-day.scss'
import ErrorRow from '../../../../shared/components/ErrorRow'

const scheduleMeetDaySchema = Yup.object().shape({
  meetDate: Yup.date().required('Required'),
  cancelMeetDay: Yup.bool().notOneOf([Yup.ref('rescheduleMeetDay')], 'Please select one action'),
  rescheduleMeetDay: Yup.bool(),
  newMeetDate: Yup.date().when('rescheduleMeetDay', {
    is: true,
    then: Yup.date().required('Required'),
    otherwise: Yup.date()
  })
})

export default class ScheduleMeetDay extends Component {

  componentDidMount() {
    const {
      programId,
      fetchMeetDayOptions
    } = this.props

    fetchMeetDayOptions(programId)
  }

  render() {
    const { 
      pageLoading,
      pageError,
      modalOpen,
      hideMeetDayModal
    } = this.props

    let content 

    if(pageLoading) {
      content = <LoadingSpinner />
    } else if(pageError) {
      content = <h2>Error</h2>
    } else {
      content = this.renderForm()
    }
    
    return (
      <AspireModal 
        isOpen={modalOpen}
        title="Modify Meet Day"
        onClose={hideMeetDayModal}
        content={content}
      />
    )
  }

  renderForm = () => {
    const { 
      meetDayOptions,
      modifyMeetDay,
      scheduleId,
      modifyingMeetDay,
      modifyingMeetDayError,
      programId
    } = this.props

    return (
      <Formik
        initialValues={{
          meetDate: 'Select One...',
          cancelMeetDay: false,
          rescheduleMeetDay: false,
          newMeetDate: ''
        }}
        validationSchema={scheduleMeetDaySchema}
        onSubmit={values => modifyMeetDay(scheduleId, values, programId)}
      >
        {({ values, errors, touched, handleSubmit, handleChange, setFieldValue }) => (
          <Form onSubmit={handleSubmit} className="mt-2">

            {modifyingMeetDayError && <ErrorRow error={modifyingMeetDayError} />}

            <Row form>
              <Col md={12}>
                <FormGroup>
                  <Label for="meetDate">Select Meet Day to Edit:</Label>
                  <Input
                    type="select"
                    name="meetDate"
                    value={values.meetDate}
                    onChange={handleChange}
                    invalid={errors.meetDate && touched.meetDate}
                  >
                    <option value="Select One..." disabled>Select One...</option>
                    {meetDayOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.text}</option>
                    ))}
                  </Input>
                  {
                    errors.meetDate && touched.meetDate
                      ? <FormFeedback>{errors.meetDate}</FormFeedback>
                    : null
                  }
                </FormGroup>
              </Col>
            </Row>

            <Row form>
              <Col md={12}>
                <FormGroup tag="fieldset">
                  <legend>Action</legend>
                  <div
                    className={errors.cancelMeetDay && touched.cancelMeetDay ? 'action-error' : ''}
                  >
                    <FormGroup check>
                      <Label check>
                        <Input 
                          type="radio" 
                          name="cancelMeetDay"
                          checked={values.cancelMeetDay}
                          invalid={errors.cancelMeetDay && touched.cancelMeetDay}
                          onChange={() => {
                            setFieldValue('cancelMeetDay', !values.cancelMeetDay)
                            setFieldValue('rescheduleMeetDay', values.cancelMeetDay)

                            if(!values.cancelMeetDay) {
                              setFieldValue('newMeetDate', '')
                            }
                          }}
                        />
                        Cancel Meeting
                      </Label>
                    </FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Input 
                          type="radio"
                          name="rescheduleMeetDay"
                          checked={values.rescheduleMeetDay}
                          invalid={errors.cancelMeetDay && touched.cancelMeetDay}
                          onChange={() => {
                            setFieldValue('rescheduleMeetDay', !values.rescheduleMeetDay)
                            setFieldValue('cancelMeetDay', values.rescheduleMeetDay)
                          }}
                        />
                        Reschedule Meeting
                      </Label>
                    </FormGroup>
                   
                  </div>
                  {
                    errors.cancelMeetDay && touched.cancelMeetDay
                      ? <FormFeedback style={{ 'display': 'block' }}>{errors.cancelMeetDay}</FormFeedback>
                      : null
                  }
                </FormGroup>
              </Col>
            </Row>
            {
              values.rescheduleMeetDay &&
              <Row form>
                <Col md={12}>
                  <FormGroup>
                    <Label for="newMeetDate">New Meet Date:</Label>
                    <Input 
                      type="date" 
                      name="newMeetDate" 
                      onChange={handleChange}
                      value={values.newMeetDate}
                      invalid={errors.newMeetDate && touched.newMeetDate}
                    />
                    {
                      errors.newMeetDate && touched.newMeetDate
                      ? <FormFeedback>{errors.newMeetDate}</FormFeedback>
                      : null
                    }
                  </FormGroup>
                </Col>
              </Row>
            }

            {/* <pre>{JSON.stringify(values)}</pre> */}
            {/* <pre>{JSON.stringify(touched)}</pre> */}

            <Row form>
              <Col md={{ size: 3, offset: 9 }}>

                {
                  modifyingMeetDay &&
                  <LoadingSpinner size={20} text=" " />
                }

                {
                  !modifyingMeetDay &&
                  <PrimaryButton
                    type="submit"
                    text="Save"
                  />
                }

              </Col>
            </Row>

          </Form>
        )}
      </Formik>
    )
  }
}