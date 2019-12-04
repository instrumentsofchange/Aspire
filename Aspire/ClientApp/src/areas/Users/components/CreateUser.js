import React, { Component } from 'react';
import { Formik } from 'formik';
import { Alert, Button, Form, Row, Col, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import * as Yup from 'yup';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import { Roles } from '../../shared/enums/RolesEnum';
import States from '../../shared/formHelpers/states';

const getMaxErrorMessage = (propertyName, maxLength, type) => {
    return `${propertyName} can be a max of ${maxLength} ${type === 'string' ? 'characters' : 'numbers'}`;
}

const userSchema = Yup.object().shape({
    firstName: Yup.string().required('Required').max(50, getMaxErrorMessage('First Name', 50, 'string')),
    lastName: Yup.string().required('Required').max(50, getMaxErrorMessage('Last Name', 50, 'string')),
    email: Yup.string().required('Required').email().max(50, getMaxErrorMessage('Email', 50, 'string')),
    program: Yup.string(),
    role: Yup.string().required('Required'),
    addressOne: Yup.string().required('Required').max(50, getMaxErrorMessage('Address One', 50, 'string')),
    addressTwo: Yup.string().max(50, getMaxErrorMessage('Address Two', 50, 'string')),
    city: Yup.string().required('Required').max(50, getMaxErrorMessage('City', 50, 'string')),
    state: Yup.string().required('Required').max(2, getMaxErrorMessage('State', 2, 'string')),
    zipCode: Yup.string().required('Required').length(5, 'Zip Code must be exactly 5 numbers').matches(/^[0-9]{5}/, 'Zip Code must be 5 positive numbers')
});

export default class CreateUser extends Component {

    componentDidMount() {
        this.props.fetchPrograms();
    }

    saveUser = (formValues) => {
        const user = {
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            // username: formValues.firstName.charAt(0).toLowerCase() + formValues.lastName.toLowerCase(),
            email: formValues.email,
            program: formValues.program,
            role: formValues.role,
            address: {
                addressOne: formValues.addressOne,
                addressTwo: formValues.addressTwo,
                city: formValues.city,
                state: formValues.state,
                zipCode: formValues.zipCode
            }
        }
        
        this.props.createUser(user);
    }

    redirectToHome = () => {
        window.location = '';
    }

    render() {
        const { 
            loading, 
            error,
            createUserSuccess
        } = this.props;

        let content;

        if(loading) {
            content = <LoadingSpinner />;
        } else if(error) {
            content = (
                <Alert color="danger">
                    {error.message}
                    <pre>{error.stack}</pre>
                </Alert>
            );
        } else if(createUserSuccess) {
            setTimeout(() => this.redirectToHome(), 1500);

            content = (
                <div>
                    <LoadingSpinner text="User successfully created!" color="success" />
                </div>
            );
        } else {
            content = this.renderForm();
        }

        return content;
    }

    renderForm = () => {
        const { 
            programOptions,
            createUserError
        } = this.props;

        return (
            <div className="row">
                <div className="col-md-8 offset-md-2 order-md-1">
                    {
                        createUserError &&
                        <div className="mt-5 mb-5">
                            <Alert color="danger">
                                {createUserError}
                            </Alert>
                        </div>
                    }
                    <h4 className="mb-3 text-center">Create New User</h4>

                    <Formik 
                        enableReinitialize={false}
                        initialValues={{
                            firstName: '',
                            lastName: '',
                            email: '',
                            program: '',
                            role: '',
                            addressOne: '',
                            addressTwo: '',
                            city: '',
                            state: '',
                            zipCode: ''
                        }}
                        validationSchema={userSchema}
                        onSubmit={values => {
                            this.saveUser(values);
                        }}
                        validate={this.validate}
                        render={({
                            values, 
                            handleChange,
                            errors,
                            touched,
                            handleSubmit
                        }) => (
                            <Form onSubmit={handleSubmit}>

                                <Row form>

                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="firstName">First Name</Label>
                                            <Input 
                                                type="text"
                                                name="firstName"
                                                value={values.firstName}
                                                onChange={handleChange}
                                                invalid={errors.firstName && touched.firstName}
                                            />
                                            {
                                                errors.firstName && touched.firstName
                                                ? <FormFeedback>{errors.firstName}</FormFeedback>
                                                : null
                                            }
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="lastName">Last Name</Label>
                                            <Input 
                                                type="text"
                                                name="lastName"
                                                value={values.lastName}
                                                onChange={handleChange}
                                                invalid={errors.lastName && touched.lastName}
                                            />
                                            {
                                                errors.lastName && touched.lastName 
                                                ? <FormFeedback>{errors.lastName}</FormFeedback>
                                                : null
                                            }
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="email">Email</Label>
                                            <Input 
                                                type="text"
                                                name="email"
                                                value={values.email}
                                                onChange={handleChange}
                                                invalid={errors.email && touched.email}
                                            />
                                            {
                                                errors.email && touched.email
                                                ? <FormFeedback>{errors.email}</FormFeedback>
                                                : null
                                            }
                                        </FormGroup>
                                    </Col>

                                </Row>
                                
                                <Row form>

                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="addressOne">Address One</Label>
                                            <Input 
                                                type="text"
                                                name="addressOne"
                                                onChange={handleChange}
                                                value={values.addressOne}
                                                invalid={errors.addressOne && touched.addressOne}
                                            />
                                            {
                                                errors.addressOne && touched.addressOne
                                                ? <FormFeedback>{errors.addressOne}</FormFeedback>
                                                : null
                                            }
                                        </FormGroup>
                                    </Col>
                                    
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="addressTwo">Adress Two</Label>
                                            <Input 
                                                type="text"
                                                name="addressTwo"
                                                onChange={handleChange}
                                                value={values.addressTwo}
                                                invalid={errors.addressTwo && touched.addressTwo}
                                            />
                                            {
                                                errors.addressTwo && touched.addressTwo
                                                ? <FormFeedback>{errors.addressTwo}</FormFeedback>
                                                : null
                                            }
                                        </FormGroup>
                                    </Col>

                                </Row>

                                <Row form>

                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="city">City</Label>
                                            <Input 
                                                type="text"
                                                name="city"
                                                onChange={handleChange}
                                                value={values.city}
                                                invalid={errors.city && touched.city}
                                            />
                                            {
                                                errors.city && touched.city
                                                ? <FormFeedback>{errors.city}</FormFeedback>
                                                : null
                                            }
                                        </FormGroup>
                                    </Col>

                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="state">State</Label>
                                            <Input
                                                type="select"
                                                name="state"
                                                onChange={handleChange}
                                                invalid={errors.state && touched.state}
                                                defaultValue="Select One..."
                                            >
                                                {this.getStateSelectOptions()}
                                            </Input>
                                            {
                                                errors.state && touched.state
                                                ? <FormFeedback>{errors.state}</FormFeedback>
                                                : null
                                            }
                                        </FormGroup>
                                    </Col>

                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="zipCode">Zip Code</Label>
                                            <Input 
                                                type="text"
                                                name="zipCode"
                                                onChange={handleChange}
                                                value={values.zipCode}
                                                invalid={errors.zipCode && touched.zipCode}
                                            />
                                            {
                                                errors.zipCode && touched.zipCode
                                                ? <FormFeedback>{errors.zipCode}</FormFeedback>
                                                : null
                                            }
                                        </FormGroup>
                                    </Col>

                                </Row>

                                <Row form>

                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="program">Program</Label>
                                            <Input 
                                                type="select"
                                                name="program"
                                                onChange={handleChange}
                                                invalid={errors.program && touched.program}
                                                defaultValue="Select One..."
                                            >
                                                {
                                                    programOptions.map(program => (
                                                        <option
                                                            key={program.value} 
                                                            value={program.value}
                                                            disabled={program.disabled}
                                                        >
                                                            {program.text}
                                                        </option>
                                                    ))
                                                }
                                            </Input>
                                            {
                                                errors.program && touched.program
                                                ? <FormFeedback>{errors.program}</FormFeedback>
                                                : null
                                            }
                                        </FormGroup>
                                    </Col>

                                    <Col md={6}>                                
                                        <FormGroup>
                                            <Label for="role">Role</Label>
                                            <Input 
                                                type="select"
                                                name="role"
                                                onChange={handleChange}
                                                invalid={errors.role && touched.role}
                                                defaultValue="Select One..."
                                            >
                                                {
                                                    this.getRolesSelectItems().map(role => (
                                                        <option 
                                                            key={role.value} 
                                                            value={role.value} 
                                                            disabled={role.disabled} 
                                                        >
                                                            {role.text}
                                                        </option>   
                                                    ))
                                                }
                                            </Input>
                                            {
                                                errors.role && touched.role
                                                ? <FormFeedback>{errors.role}</FormFeedback>
                                                : null
                                            }
                                        </FormGroup>
                                    </Col>

                                </Row>

                                <Button className="btn-block" color="primary" type="submit">Create</Button>
                                <pre>{JSON.stringify(values, null , 2)}</pre>
                            </Form>
                        )}
                    />
                </div>
            </div>
        );
    }

    getRolesSelectItems = () => {
        const defaultOption = {
            value: 'Select One...',
            text: 'Select One...',
            disabled: true,
            selected: true
        }

        const selectListItems = Object.keys(Roles).map((key, index) => {
            return {
                value: Roles[key],
                text: key.charAt(0).toUpperCase() + key.substring(1)
            };
        });

        return [defaultOption, ...selectListItems];
    }

    getStateSelectOptions = () => {
        return States.map(state => (
            <option key={state.abbreviation} value={state.abbreviation}>{state.name}</option>
        ));
    }
}