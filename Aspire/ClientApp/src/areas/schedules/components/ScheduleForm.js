import React, { Component } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Alert, Button, Row, Col, Form, FormGroup, Label, Input, CustomInput, FormFeedback } from 'reactstrap'; 
import LoadingSpinner from '../../shared/components/LoadingSpinner';

const scheduleSchema = Yup.object().shape({
  program: Yup.string().required('Required'),
  startDate: Yup.date().required('Required'),
  endDate: Yup.date().required('Required'),
  description: Yup.string().max(1000, 'Description must be less than 1000 characters!'),
  specialEvent: Yup.bool()
});

export default class ScheduleForm extends Component {

  componentDidMount() {
    const {
      isEdit,
      editScheduleId,
      fetchProgramOptions,
      fetchSchedule
    } = this.props;
    
    fetchProgramOptions();

    if(isEdit) {
      fetchSchedule(editScheduleId);
    }
  }

  getStartDateMinValue = () => {
    const { isEdit } = this.props;

    if(isEdit) {
      return null;
    } else {
      return new Date().toISOString().split('T')[0];
    }
  } 

  redirectToHome = () => window.location = '';

  getInitialValues = () => {
    const { 
      isEdit,
      schedule
    } = this.props;

    if(isEdit) {
      return schedule;
    } else {
      return {
        id: null,
        program: '',
        startDate: '',
        endDate: '',
        description: '',
        specialEvent: false
      }
    }
  }

  render() {
    const { 
      programOptionsLoading,
      scheduleLoading,
      fetchProgramOptionsError,
      fetchScheduleError,
      savingSchedule,
      scheduleSaved
    } = this.props;

    let content; 

    if(programOptionsLoading || scheduleLoading) {
      content = <LoadingSpinner />;
    } else if(fetchProgramOptionsError || fetchScheduleError) {
      content = (
        <Alert 
          className="mt-5" 
          color="danger"
        >
          There was an error loading the page
          <br/>
          Details: 
          <pre>{fetchProgramOptionsError || fetchScheduleError}</pre>
        </Alert>
      );
    } else if(savingSchedule) {
      content = <LoadingSpinner text="Saving Schedule" />;
    } else if(scheduleSaved) {
      setTimeout(() => this.redirectToHome(), 2000);

      content = <LoadingSpinner text="Successfully saved schedule!" color="success" />;
    } else {
      content = this.renderForm();
    }

    return content;
  }

  renderForm = () => {
    const { 
      isEdit,
      programOptions,
      saveSchedule,
      savingScheduleError
    } = this.props;

    return (
      <Formik 
        initialValues={this.getInitialValues()}
        validationSchema={scheduleSchema}
        onSubmit={values => saveSchedule(values)}
      >
        {({ values, errors, touched, handleSubmit, handleChange }) => (
          <Col md={{ size: 6, offset: 3 }}>

            {
              savingScheduleError &&
              <Alert color="danger">
                There was a problem saving the schedule.
                <br/>
                Details:
                <pre>{savingScheduleError}</pre>
              </Alert>
            }

            <Form onSubmit={handleSubmit} className="mt-5">

              <h2 className="text-center">{isEdit ? 'Edit' : 'Create'} Schedule</h2>

              <Row form>

                <Col md={6}>
                  <FormGroup>
                    <Label for="startDate">Start Date</Label>
                    <Input 
                      type="date"
                      name="startDate"
                      min={this.getStartDateMinValue()}
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
                  </FormGroup>
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

              </Row>

              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label for="program">Program</Label>
                    <Input
                      type="select"
                      name="program"
                      value={values.program}
                      onChange={handleChange}
                      invalid={errors.program && touched.program}
                    >
                      {
                        programOptions.map(program => (
                          <option key={program.value} value={program.value}>{program.text}</option>
                        ))
                      }
                    </Input>
                  </FormGroup>
                </Col>

                <Col md={6}>
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
                <Col md={{ size: 6, offset: 3 }}>
                  <Button className="btn-block" color="primary" type="submit">Save Schedule</Button>
                </Col>
              </Row>
            
            </Form>
          </Col>
        )}
      </Formik>
    )
  }
}