import React, { Component } from 'react';
import { Formik, Field } from 'formik';
import { Alert, Col, Row, Form, FormGroup, FormFeedback, Label, Input, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import * as Yup from 'yup';

const instrumentSchema = Yup.object().shape({
  serialNumber: Yup.string().required('Required').max(50, 'Serial Number can be a maximum of 50 characters'),
  notes: Yup.string().max(250, 'Notes can be a maximum of 250 characters'),
  instrumentType: Yup.string().required('Required').test('default-not-selected', 'Required', value => value !== 'Select One...'),
  status: Yup.string().required('Required').test('default-not-selected', 'Required', value => value !== 'Select One...'),
  make: Yup.string().required('Required').test('default-not-selected', 'Required', value => value !== 'Select One...'),
  model: Yup.string().required('Required').test('default-not-selected', 'Required', value => value !== 'Select One...'),
  program: Yup.string().nullable(),
  student: Yup.string().nullable()
});

export default class CreateEditInstrument extends Component {

  componentDidMount() {
    const {
      getInstrumentToEdit,
      getInitialInstrumentFormOptions,
      instrumentId,
    } = this.props;
    
    if (!this.props.isCreate) {
      getInstrumentToEdit(instrumentId);
    } else {
      getInitialInstrumentFormOptions();
    }
  }

  getFormInitialValues = () => {
    const defaultFormValues = {
      serialNumber: '',
      status: 'Active',
      instrumentType: '',
      notes: '',
      make: '',
      model: '',
      program: '',
      student: ''
    };

    return this.props.isCreate
      ? defaultFormValues
      : this.props.instrument;
  }

  render() {
    const {
      pageLoading,
      error
    } = this.props;

    let content;

    if (pageLoading) {
      content = <LoadingSpinner />;
    } else if (error) {
      content = (
        <Alert color="danger">
          {error.message}
          <pre>{error.stack}</pre>
        </Alert>
      );
    } else {
      content = this.renderForm();
    }

    return content;
  }

  renderForm = () => {
    const {
      isCreate,
      instrumentTypeOptions,
      makeOptions,
      modelOptions,
      programOptions,
      studentOptions,
      statusOptions,
      saveInstrument
    } = this.props;

    return (
      <Formik
        initialValues={this.getFormInitialValues()}
        validationSchema={instrumentSchema}
        onSubmit={values => {
          Object.keys(values).forEach(key => {
            if(values[key] === 'Select One...') {
              values[key] = '';
            }
          });

          saveInstrument(values);
        }}
      >
        {({ values, errors, touched, handleSubmit, handleChange, setFieldValue }) => (
          <Col md={{ size: 6, offset: 3 }}>
            <Form onSubmit={handleSubmit} className="mt-5">

              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label for="make">Make</Label>
                    <Field
                      name="make"

                      render={({ field, form }) => (
                        <Input
                          {...field}
                          type="select"
                          onChange={e => {
                            setFieldValue('make', e.target.value);
                            setFieldValue('model', '');
                            this.props.getModelOptions(e.target.value);
                          }}
                          invalid={errors.make && touched.make}
                          value={values.make}
                        >
                          <option value="" disabled>Select One...</option>
                          {makeOptions.map(make => (
                            <option key={make.value} value={make.value} disabled={make.disabled}>{make.text}</option>
                          ))}
                        </Input>
                      )}
                    />
                    {errors.make && touched.make
                      ? <FormFeedback>{errors.make}</FormFeedback>
                      : null
                    }
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="model">Model</Label>
                    <Input
                      name="model"
                      type="select"
                      onChange={handleChange}
                      invalid={errors.model && touched.model}
                      value={values.model}
                    >
                      <option value="" disabled>Select One...</option>
                      {modelOptions && modelOptions.map(model => (
                        <option key={model.value} value={model.value} disabled={model.disabled}>{model.text}</option>
                      ))}
                    </Input>
                    {errors.model && touched.model
                      ? <FormFeedback>{errors.model}</FormFeedback>
                      : null
                    }
                  </FormGroup>
                </Col>
              </Row>

              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label for="serialNumber">Serial Number</Label>
                    <Input
                      type="text"
                      name="serialNumber"
                      value={values.serialNumber}
                      onChange={handleChange}
                      invalid={errors.serialNumber && touched.serialNumber}
                    />
                    {errors.serialNumber && touched.serialNumber
                      ? <FormFeedback>{errors.serialNumber}</FormFeedback>
                      : null
                    }
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="status">Status</Label>
                    <Input
                      name="status"
                      type="select"
                      onChange={handleChange}
                      invalid={errors.status && touched.status}
                      value={values.status}
                    >
                      <option value="" disabled>Select One...</option>
                      {statusOptions.map(status => (
                        <option key={status.value} value={status.value}>{status.text}</option>
                      ))}
                    </Input>
                    {errors.status && touched.status
                      ? <FormFeedback>{errors.status}</FormFeedback>
                      : null
                    }
                  </FormGroup>
                </Col>
              </Row>

              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label for="program">Program</Label>
                    <Field
                      name="program"
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="select"
                          onChange={({ target: { value } }) => {
                            this.props.getStudentOptions(value);
                            setFieldValue('program', value);
                            setFieldValue('student', '');
                          }}
                          invalid={errors.program && touched.program}
                          value={values.program}
                        >
                          <option value="" disabled>Select One...</option>
                          {programOptions.map(program => (
                            <option key={program.value} value={program.value} disabled={program.disabled}>{program.value}</option>
                          ))}
                        </Input>
                      )}
                    />
                    {errors.program && touched.program
                      ? <FormFeedback>{errors.program}</FormFeedback>
                      : null
                    }
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="student">Students</Label>
                    <Input
                      name="student"
                      type="select"
                      onChange={handleChange}
                      invalid={errors.student && touched.student}
                      value={values.student}
                    >
                      <option value="" disabled>Select One...</option>
                      {studentOptions && studentOptions.map(student => (
                        <option key={student.value} value={student.value} disabled={student.disabled}>{student.value}</option>
                      ))}
                    </Input>
                    {errors.student && touched.student
                      ? <FormFeedback>{errors.student}</FormFeedback>
                      : null
                    }
                  </FormGroup>
                </Col>
              </Row>

              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label for="notes">Notes</Label>
                    <Input
                      type="textarea"
                      name="notes"
                      value={values.notes}
                      onChange={handleChange}
                      invalid={errors.notes && touched.notes}
                    />
                    {errors.notes && touched.notes
                      ? <FormFeedback>{errors.notes}</FormFeedback>
                      : null
                    }
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="instrumentType">Instrument Type</Label>
                    <Input
                      name="instrumentType"
                      type="select"
                      onChange={handleChange}
                      invalid={errors.instrumentType && touched.instrumentType}
                      value={values.instrumentType}
                    >
                      <option value="" disabled>Select One...</option>
                      {instrumentTypeOptions.map(instrument => (
                        <option key={instrument.value} value={instrument.value} disabled={instrument.disabled}>{instrument.text}</option>
                      ))}
                    </Input>
                    {errors.instrumentType && touched.instrumentType
                      ? <FormFeedback>{errors.instrumentType}</FormFeedback>
                      : null
                    }
                  </FormGroup>
                </Col>
              </Row>

              <Row form>
                <Col md={{ size: 6, offset: 3 }}>
                  <Button className="btn-block" color="primary" type="submit">Save Instrument</Button>
                </Col>
              </Row>
              <pre>{JSON.stringify(values, null, 2)}</pre>
            </Form>
          </Col>
        )}
      </Formik>
    )
  }
}