import React, { Component } from 'react';
import { Formik } from 'formik';
import { Alert, Button, Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import * as Yup from 'yup';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import { Roles } from '../../shared/enums/RolesEnum';

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
                <div className="col-md-6 offset-md-3 order-md-1">
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
        return [
            <option key="Select One..." value="Select One..." disabled>Select One...</option>,
            <option key="AL" value="AL">Alabama</option>,
            <option key="AK" value="AK">Alaska</option>,
            <option key="AZ" value="AZ">Arizona</option>,
            <option key="AR" value="AR">Arkansas</option>,
            <option key="CA" value="CA">California</option>,
            <option key="CO" value="CO">Colorado</option>,
            <option key="CT" value="CT">Connecticut</option>,
            <option key="DE" value="DE">Delaware</option>,
            <option key="DC" value="DC">District Of Columbia</option>,
            <option key="FL" value="FL">Florida</option>,
            <option key="GA" value="GA">Georgia</option>,
            <option key="HI" value="HI">Hawaii</option>,
            <option key="ID" value="ID">Idaho</option>,
            <option key="IL" value="IL">Illinois</option>,
            <option key="IN" value="IN">Indiana</option>,
            <option key="IA" value="IA">Iowa</option>,
            <option key="KS" value="KS">Kansas</option>,
            <option key="KY" value="KY">Kentucky</option>,
            <option key="LA" value="LA">Louisiana</option>,
            <option key="ME" value="ME">Maine</option>,
            <option key="MD" value="MD">Maryland</option>,
            <option key="MA" value="MA">Massachusetts</option>,
            <option key="MI" value="MI">Michigan</option>,
            <option key="MN" value="MN">Minnesota</option>,
            <option key="MS" value="MS">Mississippi</option>,
            <option key="MO" value="MO">Missouri</option>,
            <option key="MT" value="MT">Montana</option>,
            <option key="NE" value="NE">Nebraska</option>,
            <option key="NV" value="NV">Nevada</option>,
            <option key="NH" value="NH">New Hampshire</option>,
            <option key="NJ" value="NJ">New Jersey</option>,
            <option key="NM" value="NM">New Mexico</option>,
            <option key="NY" value="NY">New York</option>,
            <option key="NC" value="NC">North Carolina</option>,
            <option key="ND" value="ND">North Dakota</option>,
            <option key="OH" value="OH">Ohio</option>,
            <option key="OK" value="OK">Oklahoma</option>,
            <option key="OR" value="OR">Oregon</option>,
            <option key="PA" value="PA">Pennsylvania</option>,
            <option key="RI" value="RI">Rhode Island</option>,
            <option key="SC" value="SC">South Carolina</option>,
            <option key="SD" value="SD">South Dakota</option>,
            <option key="TN" value="TN">Tennessee</option>,
            <option key="TX" value="TX">Texas</option>,
            <option key="UT" value="UT">Utah</option>,
            <option key="VT" value="VT">Vermont</option>,
            <option key="VA" value="VA">Virginia</option>,
            <option key="WA" value="WA">Washington</option>,
            <option key="WV" value="WV">West Virginia</option>,
            <option key="WI" value="WI">Wisconsin</option>,
            <option key="WY" value="WY">Wyoming</option>
        ];
    }
}