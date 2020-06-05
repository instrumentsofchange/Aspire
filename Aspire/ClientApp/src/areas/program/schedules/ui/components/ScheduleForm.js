import React, { Component } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Select from 'react-select'
import { isNil } from 'lodash'
import { Alert, Button, Row, Col, Form, FormGroup, Label, Input, CustomInput, FormFeedback } from 'reactstrap'
import Tools from '../../../../shared/Tools/index'
import AspireModal from '../../../../shared/components/AspireModal'
import PrimaryButton from '../../../../shared/components/PrimaryButton'
import LoadingSpinner from '../../../../shared/components/LoadingSpinner'
import ErrorRow from '../../../../shared/components/ErrorRow'

const yesterday = () => {
  let result = new Date()

  result.setDate(result.getDate() - 1)

  return result
}

const scheduleSchema = Yup.object().shape({
  programId: Yup.number().required('Required'),
  startDate: Yup.date().required('Required')
    .when(
      'isCreate', 
      (isCreate, schema) => schema.min(isCreate ? yesterday() : new Date(2000, 1, 1), 'Start Date must be on or after today')), 
  endDate: Yup.date().required('Required')
    .when(
      'startDate',
      (startDate, schema) => {
        return schema.min(startDate, 'End Date must be after Start Date')
      }),
  meetDays: Yup.array().required('Required'),
  description: Yup.string().max(1000, 'Description must be less than 1000 characters!'),
  specialEvent: Yup.bool()
})

export default class ScheduleForm extends Component {

  static todaysDate = new Date().toISOString().split('T')[0]

  componentDidMount() {
    const {
      isCreate,
      scheduleId,
      fetchSchedule
    } = this.props

    if(!isCreate) {
      fetchSchedule(scheduleId)
    }
  }

  getInitialValues = () => {
    const {
      isCreate,
      schedule,
      programId
    } = this.props;

    if (isCreate) {
      return {
        id: 0,
        programId: parseInt(programId),
        startDate: '0000-00-00',
        endDate: '0000-00-00',
        meetDays: [],
        description: '',
        specialEvent: false,
        isCreate
      }
    } else {
      return {
        ...schedule,
        startDate: Tools.transformDateFromServer(schedule.startDate),
        endDate: Tools.transformDateFromServer(schedule.endDate),
        isCreate
      }
    }
  }

  getStartDateMinValue = () => {
    const { isCreate } = this.props

    if (isCreate) {
      return new Date().toISOString().split('T')[0]
    } else {
      return null
    }
  } 

  render() {
    const { 
      pageLoading,
      pageError,
      isOpen,
      isCreate,
      hideFormModal,
    } = this.props

    let content

    if(pageLoading) {
      content = <LoadingSpinner />
    } else if(pageError) {
      content = <h3>Error</h3>
    } else {
      content = this.renderForm()
    }

    return (
      <AspireModal
        isOpen={isOpen}
        onClose={hideFormModal}
        title={`${isCreate ? 'Create' : 'Edit'} Schedule`}
        content={content}
      />
    )
  }

  renderForm = () => {
    const {
      isCreate,
      schedule,
      saveSchedule,
      savingSchedule,
      savingScheduleError
    } = this.props;

    const days = [
      { value: 'Monday', label: 'Monday' },
      { value: 'Tuesday', label: 'Tuesday' },
      { value: 'Wednesday', label: 'Wednesday' },
      { value: 'Thursday', label: 'Thursday' },
      { value: 'Friday', label: 'Friday' },
      { value: 'Saturday', label: 'Saturday' }
    ];

    return !isCreate && !schedule ? null : (
      <Formik
        initialValues={this.getInitialValues()}
        validationSchema={scheduleSchema}
        onSubmit={values => saveSchedule(values)}
      >
        {({ values, errors, touched, handleSubmit, handleChange, setFieldValue }) => (
          <Form onSubmit={handleSubmit} className="mt-2">

            {savingScheduleError && <ErrorRow error={savingScheduleError} />}
            
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label for="startDate">Start Date</Label>
                  <Input
                    type="date"
                    name="startDate"
                    // min={this.todaysDate}
                    // max={values.endDate}
                    onChange={handleChange}
                    value={values.startDate}
                    invalid={errors.startDate && touched.startDate}
                    disabled={!isCreate}
                  />
                  {
                    errors.startDate && touched.startDate
                      ? <FormFeedback>{errors.startDate}</FormFeedback>
                      : null
                  }
                </FormGroup>
              </Col>

              <Col md={6}>
                <Label for="endDate">End Date</Label>
                <Input
                  type="date"
                  name="endDate"
                  // min={isCreate ? values.startDate : this.todaysDate}
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

            </Row>

            <Row form>
              <Col>
                <FormGroup>
                  <Label for="meetDays">Meet Days</Label>
                  <Select
                    defaultValue={"Select One..."}
                    isMulti
                    name="meetDays"
                    value={values.meetDays.map(day => ({ value: day, label: day }))}
                    options={days}
                    isSearchable={false}
                    styles={{
                      control: (base, state) => {
                        const invalid = {
                          ...base,
                          borderColor: '#dc3545'
                        };
                        return errors.meetDays && touched.meetDays ? invalid : { ...base }
                      }
                    }}
                    onChange={(values) => {
                      const selectedValues = isNil(values) ? [] : values.map(day => day.value);

                      setFieldValue('meetDays', selectedValues);
                    }}
                  // className={errors.meetDays && touched.meetDays ? 'form-control is-invalid' : ''}
                  />
                  {
                    errors.meetDays && touched.meetDays
                      ? (
                        <div>
                          <div className="form-control is-invalid" style={{ display: 'none' }}></div>
                          <FormFeedback>{errors.meetDays}</FormFeedback>
                        </div>
                      )
                      : null
                  }
                </FormGroup>
              </Col>
            </Row>

            <Row form>
              <Col md={12}>
                <FormGroup>
                  <Label for="specialEvent">Special Event?</Label>
                  <CustomInput
                    type="checkbox"
                    id="specialEvent"
                    onChange={handleChange}
                    checked={values.specialEvent}
                  />
                  {
                    errors.specialEvent && touched.specialEvent
                      ? <FormFeedback>{errors.specialEvent}</FormFeedback>
                      : null
                  }
                </FormGroup>
              </Col>
            </Row>

            <Row form>
              <Col md={12}>
                <FormGroup>
                  <Label for="description">Description</Label>
                  <Input
                    type="textarea"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    invalid={errors.description && touched.description}
                  />
                  {
                    errors.description && touched.description
                      ? <FormFeedback>{values.description}</FormFeedback>
                      : null
                  }
                </FormGroup>
              </Col>
            </Row>

            <Row form>
              <Col md={{ size: 5, offset: 7 }}>
                {
                  !savingSchedule && 
                  <PrimaryButton 
                    type="submit"
                    text="Save Schedule"
                  />
                }

                {
                  savingSchedule &&
                  <LoadingSpinner size={20} text=" " />
                }
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    )
  }
}