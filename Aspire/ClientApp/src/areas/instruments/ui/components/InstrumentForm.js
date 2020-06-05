import React, { Component } from 'react'
import { isNil } from 'lodash'
import { Formik, Field } from 'formik'
import { Alert, Col, Row, Form, FormGroup, FormFeedback, Label, Input, Button } from 'reactstrap'
import { LoadingSpinner, ErrorRow, PrimaryButton, LinkButton, AspireSelect } from '../../../shared/components'
import * as Yup from 'yup'
import './styles/instrument-form.scss'

const instrumentSchema = Yup.object().shape({
  serialNumber: Yup.string().required('Required').max(50, 'Serial Number can be a maximum of 50 characters'),
  notes: Yup.string().max(250, 'Notes can be a maximum of 250 characters'),
  type: Yup.string().required('Required').nullable(),
  status: Yup.string().required('Required').nullable(),
  make: Yup.object().shape({
    id: Yup.number().typeError('Required').required('Required').test('not-default', 'Required', value => value !== 0 && value > 0)
  }),
  model: Yup.object().shape({
    id: Yup.number().typeError('Required').required('Required').test('not-default', 'Required', value => value !== 0 && value > 0)
  }),
  program: Yup.object().shape({
    id: Yup.number().typeError('Required').required('Required').test('not-default', 'Required', value => value !== 0 && value > 0)
  }),
  student: Yup.object().shape({
    id: Yup.number().nullable(true)
  })
});

export default class InstrumentForm extends Component {

  componentDidMount() {
    this.props.initializeForm(this.props.instrumentId)
  }

  render() {
    const {
      formConstants: {
        typeOptions,
        makeOptions,
        modelOptions,
        programOptions,
        statusOptions,
        studentOptions
      },
      instrument,
      fetchStudentOptions,
      loadingModelOptions,
      loadingStudentOptions,
      saveInstrument,
      savingInstrumentError,
      error,
      loading
    } = this.props

    return loading ? (
      <LoadingSpinner size={50} />
    ) : (
      <Formik
        initialValues={instrument}
        validationSchema={instrumentSchema}
        onSubmit={values => saveInstrument(values)}
      >
        {({ values, errors, touched, handleSubmit, handleChange, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>

            {error || savingInstrumentError && <ErrorRow error={error || savingInstrumentError} />}

            {!loading && !error &&
              <div>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="make">Make</Label>
                      <AspireSelect
                        simpleValue
                        name="make"
                        options={makeOptions}
                        value={values.make && `${values.make.id}`}
                        placeholder="Select One..."
                        onChange={value => {
                          setFieldValue('make.id', parseInt(value))
                          setFieldValue('model.id', null)

                          this.props.fetchModelOptions(value)
                          // this.handleMakeChange(value)
                        }}
                        className={errors.make && errors.make.id && touched.make && touched.make.id && 'invalid'}
                      />
                      {errors.make && errors.make.id && touched.make && touched.make.id && <div className="invalid-message">{errors.make.id}</div>}
                    </FormGroup>
                  </Col>

                  <Col md={6}>
                    <FormGroup>
                      <Label for="model">Model</Label>
                      {
                        loadingModelOptions
                          ? (
                            <LoadingSpinner
                              size={25}
                              message="Loading Model Options..."
                            />
                          )
                          : (
                            <AspireSelect
                              simpleValue
                              name="model"
                              options={modelOptions}
                              disabled={modelOptions.length <= 0}
                              value={values.model && `${values.model.id}`}
                              onChange={value => setFieldValue('model.id', parseInt(value))}
                              className={errors.model && errors.model.id && touched.model && touched.model.id && 'invalid'}
                            />
                          )
                      }
                      {errors.model && errors.model.id && touched.model && touched.model.id && <div className="invalid-message">{errors.model.id}</div>}
                    </FormGroup>
                  </Col>
                </Row>

                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="program">Program</Label>
                      <AspireSelect
                        simpleValue
                        name="program"
                        options={programOptions}
                        value={values.program && `${values.program.id}`}
                        onChange={value => {
                          setFieldValue('program.id', parseInt(value))
                          setFieldValue('student.id', null)

                          fetchStudentOptions(value)
                        }}
                        className={errors.program && errors.program.id && touched.program && touched.program.id && 'invalid'}
                      />
                      {errors.program && errors.program.id && touched.program && touched.program.id && <div className="invalid-message">{errors.program.id}</div>}
                    </FormGroup>
                  </Col>

                  <Col md={6}>
                    <FormGroup>
                      <Label for="student">Student</Label>
                      {
                        loadingStudentOptions
                          ? (
                            <LoadingSpinner
                              size={25}
                              message="Loading Model Options..."
                            />
                          )
                          : (
                            <div>
                              <AspireSelect
                                simpleValue
                                name="student"
                                options={studentOptions}
                                disabled={studentOptions.length <= 0}
                                value={values.student && `${values.student.id}`}
                                onChange={value => setFieldValue('student.id', value === null ? null : parseInt(value))}
                                className={errors.student && errors.student.id && touched.student && touched.student.id && 'invalid'}
                              />
                              {errors.student && errors.student.id && touched.student && touched.student.id && <div className="invalid-message">{errors.student.id}</div>}
                            </div>
                          )
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
                      {errors.serialNumber && touched.serialNumber && <div className="invalid-message">{errors.serialNumber}</div>}
                    </FormGroup>
                  </Col>
                </Row>

                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="type">Type</Label>
                      <AspireSelect
                        simpleValue
                        name="type"
                        value={values.type}
                        options={typeOptions}
                        onChange={value => setFieldValue('type', value)}
                        className={errors.type && touched.type && 'invalid'}
                      />
                      {errors.type && touched.type && <div className="invalid-message">{errors.type}</div>}
                    </FormGroup>
                  </Col>

                  <Col md={6}>
                    <FormGroup>
                      <Label for="status">Status</Label>
                      <AspireSelect
                        simpleValue
                        name="status"
                        value={values.status}
                        options={statusOptions}
                        onChange={value => setFieldValue('status', value)}
                        className={errors.status && touched.status && 'invalid'}
                      />
                      {errors.status && touched.status && <div className="invalid-message">{errors.status}</div>}
                    </FormGroup>
                  </Col>
                </Row>

                <Row form>
                  <Col>
                    <FormGroup>
                      <Label for="notes">Notes</Label>
                      <Input
                        name="notes"
                        type="textarea"
                        value={values.notes}
                        onChange={handleChange}
                        invalid={errors.notes && touched.notes}
                      />
                      {errors.notes && touched.notes && <div className="invalid-message">{errors.notes}</div>}
                    </FormGroup>
                  </Col>
                </Row>
              </div>
            }

            {this.renderFooter()}
            
          </Form>
        )}
      </Formik>
    )
  }

  renderFooter = () => {
    const { loading, error, savingInstrument, onClose } = this.props

    return (
      <Row form>
        <Col md={{ size: 5, offset: 7 }} className="footer-button-container">

          {!savingInstrument && 
            <div>
              {!loading && isNil(error) && 
                <PrimaryButton
                  type="submit"
                  text="Save Instrument"
                  className="mr-3"
                />
              }

            <LinkButton
              onClick={onClose}
              text="Cancel"
              className="mr-3"
            />

            </div>
          }

          {
            savingInstrument &&
            <LoadingSpinner size={20} text=" " />
          }

        </Col>
      </Row>
    )
  }
}