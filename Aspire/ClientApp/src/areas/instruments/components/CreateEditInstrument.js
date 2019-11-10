import React, { Component } from 'react';
import { Formik, Field } from 'formik';
import { Alert, Form, FormGroup, FormFeedback, Label, Input, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import * as Yup from 'yup';

const instrumentSchema = Yup.object().shape({
    serialNumber: Yup.string().required('Required').max(50, 'Serial Number can be a maximum of 50 characters'),
    notes: Yup.string().max(250, 'Notes can be a maximum of 250 characters'),
    instrumentType: Yup.string().required('Required'),
    make: Yup.string().required('Required'),
    model: Yup.string().required('Required'),
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

        if(!this.props.isCreate) {
            getInstrumentToEdit(instrumentId);
        } else {
            getInitialInstrumentFormOptions();
        }
    }

    getFormInitialValues = () => {
        const defaultFormValues = {
            serialNumber: '',
            instrumentType: '',
            notes: '',
            Make: '',
            Model: '',
            Program: '',
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

        if(pageLoading) {
            content = <LoadingSpinner />;
        } else if(error) {
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
            instrument,
            saveInstrument
        } = this.props;

        return (
            <div className="row">
            <div className="col-md-6 offset-md-3 order-md-1">
                <h4 className="mb-3 text-center">{isCreate ? 'Create' : 'Edit'} Instrument</h4>

                <Formik
                    enableReinitialize={false}
                    initialValues={this.getFormInitialValues()}
                    validationSchema={instrumentSchema}
                    onSubmit={values => {
                        saveInstrument(values);
                    }}
                    validate={this.validate}
                    render={props => (
                        <Form onSubmit={props.handleSubmit}>
                            <FormGroup>
                                <Label for="serialNumber">Serial Number</Label>
                                <Input 
                                    type="text"
                                    name="serialNumber"
                                    value={props.values.serialNumber}
                                    onChange={props.handleChange}
                                    invalid={props.errors.serialNumber && props.touched.serialNumber }
                                />
                                {props.errors.serialNumber && props.touched.serialNumber 
                                    ? <FormFeedback>{props.errors.serialNumber}</FormFeedback>
                                    : null
                                }
                            </FormGroup>

                            <FormGroup>
                                <Label for="notes">Notes</Label>
                                <Input 
                                    type="textarea"
                                    name="notes"
                                    value={props.values.notes}
                                    onChange={props.handleChange}
                                    invalid={props.errors.notes && props.touched.notes}
                                />
                                {props.errors.notes && props.touched.notes
                                    ? <FormFeedback>{props.errors.notes}</FormFeedback>
                                    : null
                                }
                            </FormGroup>

                            <FormGroup>
                                <Label for="instrumentType">Instrument Type</Label>
                                <Input 
                                    name="instrumentType" 
                                    type="select"
                                    onChange={props.handleChange}
                                    invalid={props.errors.instrumentType && props.touched.instrumentType}
                                    value={isCreate ? '' : instrument.instrumentType}
                                >
                                    {instrumentTypeOptions.map(instrument => (
                                        <option key={instrument.value} value={instrument.value}>{instrument.text}</option>
                                    ))}
                                </Input>
                                {props.errors.instrumentType && props.touched.instrumentType 
                                    ? <FormFeedback>{props.errors.instrumentType}</FormFeedback>
                                    : null
                                } 
                            </FormGroup>

                            <FormGroup>
                                <Label for="make">Make</Label>
                                <Field 
                                    name="make"
                                    
                                    render={({ field, form }) => (
                                        <Input 
                                            {...field} 
                                            type="select" 
                                            onChange={e => {
                                                form.setFieldValue('make', e.target.value);
                                                this.props.getModelOptions(e.target.value);
                                            }}
                                            invalid={props.errors.make && props.touched.make }
                                            value={isCreate ? '' : instrument.make}
                                        >
                                            {makeOptions.map(make => (
                                                <option key={make.value} value={make.value}>{make.text}</option>
                                            ))}
                                        </Input>
                                    )}
                                />
                                {props.errors.make && props.touched.make 
                                    ? <FormFeedback>{props.errors.make}</FormFeedback>
                                    : null
                                } 
                            </FormGroup>

                            <FormGroup>
                                <Label for="model">Model</Label>
                                <Input
                                    name="model"
                                    type="select"
                                    onChange={props.handleChange}
                                    invalid={props.errors.model && props.touched.model}
                                    value={isCreate ? '' : instrument.model}
                                >
                                    {modelOptions && modelOptions.map(model => (
                                        <option key={model.value} value={model.value}>{model.text}</option>
                                    ))}
                                </Input>
                                {props.errors.model && props.touched.model 
                                    ? <FormFeedback>{props.errors.model}</FormFeedback>
                                    : null
                                } 
                            </FormGroup>

                            <FormGroup>
                                <Label for="program">Program</Label>
                                <Field
                                    name="program"
                                    render={({ field, form }) => (
                                        <Input
                                            {...field}
                                            type="select"
                                            onChange={e => {
                                                this.props.getStudentOptions(e.target.value);
                                                form.setFieldValue('program', e.target.value);
                                            }}
                                            invalid={props.errors.program && props.touched.program}
                                            value={isCreate ? '' : instrument.program}
                                        >
                                            {programOptions.map(program => (
                                                <option key={program.value} value={program.value}>{program.value}</option>
                                            ))}
                                        </Input>
                                    )}
                                />
                                {props.errors.program && props.touched.program 
                                    ? <FormFeedback>{props.errors.program}</FormFeedback>
                                    : null
                                } 
                            </FormGroup>

                            <FormGroup>
                                <Label for="student">Students</Label>
                                <Input 
                                    name="student"
                                    type="select"
                                    onChange={props.handleChange}
                                    invalid={props.errors.student && props.touched.student}
                                    value={isCreate ? '' : instrument.student}
                                >
                                    {studentOptions && studentOptions.map(student => (
                                        <option key={student.value} value={student.value}>{student.value}</option>
                                    ))}
                                </Input>
                                {props.errors.student && props.touched.student 
                                    ? <FormFeedback>{props.errors.student}</FormFeedback>
                                    : null
                                } 
                            </FormGroup>

                            <Button className="btn-block" color="primary" type="submit">{isCreate ? 'Create' : 'Edit'}</Button>
                            <pre>{JSON.stringify(props.values, null, 2)}</pre>
                        </Form>
                    )}
                />
            </div>
        </div>
        );
    }
}