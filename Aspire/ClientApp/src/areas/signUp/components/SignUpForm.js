import React, { Component } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Alert, Button, Container, Form, Row, Col, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import LoadingSpinner from '../../shared/components/LoadingSpinner';

const getMaxErrorMessage = (propertyName, maxLength, type) => {
  return `${propertyName} can be a max of ${maxLength} ${type === 'string' ? 'characters' : 'numbers'}`;
}

const signUpSchema = Yup.object().shape({
  firstName: Yup.string().required('Required').max(50, getMaxErrorMessage('First Name', 50, 'string')),
  middleInitial: Yup.string().max(1, getMaxErrorMessage('Middle Initial', 1, 'string')),
  lastName: Yup.string().required('Required').max(50, getMaxErrorMessage('Last Name', 50, 'string')),
  studentNumber: Yup.number().required('Required').positive('Must be a positive number').moreThan(0, 'Must be greater than 0').lessThan(99999999, 'Must be less than 99999999').integer('Must be a whole number'),
  homeroomTeacher: Yup.string().required('Required').max(50, getMaxErrorMessage('Homeroom Teacher', 50, 'string')),
  streetAddress: Yup.string().required('Required').max(50, getMaxErrorMessage('Address', 50, 'string')),
  city: Yup.string().required('Required').max(50, getMaxErrorMessage('City', 50, 'string')),
  zipCode: Yup.string().required('Required').length(5, 'Zip Code must be exactly 5 numbers').matches(/^[0-9]{5}/, 'Zip Code must be 5 positive numbers'),
  dateOfBirth: Yup.date().required('Required').max(new Date(), 'Date of Birth must be before today'),
  program: Yup.string().required('Required').test('is-selected', 'Required', value => value !== 'Select One...'),
  shirtSize: Yup.string().required('Required').test('is-selected', 'Required', value => value !== 'Select One...'),
  parentOneFirstName: Yup.string().required('Required').max(50, getMaxErrorMessage('First Name', 50, 'string')),
  parentOneLastName: Yup.string().required('Required').max(50, getMaxErrorMessage('Last Name', 50, 'string')),
  parentOnePhoneNumber: Yup.string().required('Required').matches(/^(?:\(\d{3}\)) \d{3}-\d{4}$/, 'Must be in form (XXX) XXX-XXXX'),
  parentOneEmail: Yup.string().email('Must be a valid email').required('Required').max(50, getMaxErrorMessage('Email', 50, 'string')),
  parentTwoFirstName: Yup.string().max(50, getMaxErrorMessage('First Name', 50, 'string')),
  parentTwoLastName: Yup.string().max(50, getMaxErrorMessage('Last Name', 50, 'string')),
  parentTwoPhoneNumber: Yup.string().matches(/^(?:\(\d{3}\)) \d{3}-\d{4}$/, 'Must be in form (XXX) XXX-XXXX'),
  parentTwoEmail: Yup.string().email('Must be a valid email').max(50, getMaxErrorMessage('Email', 50, 'string')),
  allergies: Yup.string().max(200, getMaxErrorMessage('Allergies', 200, 'string')),
  emergencyContactOneName: Yup.string().required('Required').max(100, getMaxErrorMessage('Name', 50, 'string')),
  emergencyContactOneRelationship: Yup.string().required('Required').max(50, getMaxErrorMessage('Relationship', 50, 'string')),
  emergencyContactOnePhoneNumber: Yup.string().required('Required').matches(/^(?:\(\d{3}\)) \d{3}-\d{4}$/, 'Must be in form (XXX) XXX-XXXX'),
  emergencyContactTwoName: Yup.string().max(100, getMaxErrorMessage('Name', 50, 'string')),
  emergencyContactTwoRelationship: Yup.string().max(50, getMaxErrorMessage('Relationship', 50, 'string')),
  emergencyContactTwoPhoneNumber: Yup.string().matches(/^(?:\(\d{3}\)) \d{3}-\d{4}$/, 'Must be in form (XXX) XXX-XXXX'),
});

export default class SignUpForm extends Component {

  componentDidMount() {
    this.props.fetchProgramOptions();
  }

  render() {
    const {
      programOptionsLoading,
      fetchProgramOptionsError,
      savingStudent,
      savingStudentError
    } = this.props;

    let content;

    if(programOptionsLoading) {
      content = <LoadingSpinner />;
    } else if(fetchProgramOptionsError) {
      content = (
        <Alert color="danger">
          There was a problem loading the page. Please contact your administrator or try again later.
        </Alert>
      );
    } else if(savingStudent) {
      content = <LoadingSpinner color="success" text="Saving..." />;
    } else if(savingStudentError) {
      content = (
        <Alert color="danger">
          There was a problem signing you up. Please contact your administrator or try again later.
        </Alert>
      );
    } else {
      content = (
        <Container>
        <Row>
          <Col md={{ size: 8, offset: 2 }}>

            <h3 className="mt-5 mb-5 text-center">New Student Sign Up</h3>

            {this.renderForm()}
          </Col>
        </Row>
      </Container>
      );
    }

    return content;
  }

  renderFieldError = (errors, touched, fieldName) => {
    return errors[fieldName] && touched[fieldName]
      ? <FormFeedback>{errors[fieldName]}</FormFeedback>
      : null;
  }

  renderForm = () => {
    const { 
      programOptions,
      saveStudent
    } = this.props;

    return (
      <Formik
        initialValues={{
          id: 0,
          firstName: '',
          middleInitial: '',
          lastName: '',
          studentNumber: '',
          homeroomTeacher: '',
          streetAddress: '',
          city: '',
          zipCode: '',
          dateOfBirth: '',
          program: 'Select One...',
          shirtSize: 'Select One...',
          allergies: '',
          
          parentOneFirstName: '',
          parentOneLastName: '',
          parentOnePhoneNumber: '',
          parentOneEmail: '',
          parentOneCanContact: false,
          
          parentTwoFirstName: '',
          parentTwoLastName: '',
          parentTwoPhoneNumber: '',
          parentTwoEmail: '',
          parentTwoCanContact: false,
          
          emergencyContactOneName: '',
          emergencyContactOneRelationship: '',
          emergencyContactOnePhoneNumber: '',
          
          emergencyContactTwoName: '',
          emergencyContactTwoRelationship: '',
          emergencyContactTwoPhoneNumber: ''
        }}
        validationSchema={signUpSchema}
        validate={this.validate}
        onSubmit={values => saveStudent(values)}
      >
        {({ values, errors, touched, handleSubmit, handleChange, setFieldValue }) => (
          <Form onSubmit={handleSubmit} noValidate>

            <Row form>
              <Col md={5}>
                <FormGroup>
                  <Label for="firstName">First Name</Label>
                  <Input 
                    type="text"
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    invalid={errors.firstName && touched.firstName}
                  />
                  {this.renderFieldError(errors, touched, 'firstName')}
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup>
                  <Label for="middleInitial">Middle Initial</Label>
                  <Input 
                    type="text"
                    name="middleInitial"
                    value={values.middleInitial}
                    onChange={handleChange}
                    invalid={errors.middleInitial && touched.middleInitial}
                  />
                  {this.renderFieldError(errors, touched, 'middleInitial')}
                </FormGroup>
              </Col>
              <Col md={5}>
                <FormGroup>
                  <Label for="lastName">Last Name</Label>
                  <Input 
                    type="text"
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    invalid={errors.lastName && touched.lastName}
                  />
                  {this.renderFieldError(errors, touched, 'lastName')}
                </FormGroup>
              </Col>
            </Row>

            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label for="studentNumber">Student Id#</Label>
                  <Input 
                    type="number"
                    name="studentNumber"
                    value={values.studentNumber}
                    onChange={handleChange}
                    invalid={errors.studentNumber && touched.studentNumber}
                  />
                  {this.renderFieldError(errors, touched, 'studentNumber')}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="homeroomTeacher">Homeroom Teacher</Label>
                  <Input 
                    type="text"
                    name="homeroomTeacher"
                    value={values.homeroomTeacher}
                    onChange={handleChange}
                    invalid={errors.homeroomTeacher && touched.homeroomTeacher}
                  />
                  {this.renderFieldError(errors, touched, 'homeroomTeacher')}
                </FormGroup>
              </Col>
            </Row>

            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label for="streetAddress">Street Address</Label>
                  <Input 
                    type="text"
                    name="streetAddress"
                    value={values.streetAddress}
                    onChange={handleChange}
                    invalid={errors.streetAddress && touched.streetAddress}
                  />
                  {this.renderFieldError(errors, touched, 'streetAddress')}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="city">City</Label>
                  <Input 
                    type="text"
                    name="city"
                    value={values.city}
                    onChange={handleChange}
                    invalid={errors.city && touched.city}
                  />
                  {this.renderFieldError(errors, touched, 'city')}
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup>
                  <Label for="zipCode">Zip Code</Label>
                  <Input 
                    type="text"
                    name="zipCode"
                    value={values.zipCode}
                    onChange={handleChange}
                    invalid={errors.zipCode && touched.zipCode}
                  />
                  {this.renderFieldError(errors, touched, 'zipCode')}
                </FormGroup>
              </Col>
            </Row>

            <Row form>
              <Col md={4}>
                <FormGroup>
                  <Label for="dateOfBirth">Date of Birth</Label>
                  <Input 
                    type="date"
                    name="dateOfBirth"
                    max={new Date().toISOString().split('T')[0]}
                    value={values.dateOfBirth}
                    onChange={handleChange}
                    invalid={errors.dateOfBirth && touched.dateOfBirth}
                  />
                  {this.renderFieldError(errors, touched, 'dateOfBirth')}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="program">School</Label>
                  <Input
                    type="select"
                    name="program"
                    onChange={handleChange}
                    value={values.program}
                    invalid={errors.program && touched.program}
                  >
                    {
                      programOptions.map(option => (
                        <option value={option.value} key={option.value} disabled={option.disabled}>{option.text}</option>
                      ))
                    }
                  </Input>
                  {this.renderFieldError(errors, touched, 'program')}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="shirtSize">Shirt Size</Label>
                  <Input
                    type="select"
                    name="shirtSize"
                    value={values.shirtSize}
                    onChange={handleChange}
                    invalid={errors.shirtSize && touched.shirtSize}
                  >
                    <option disabled value="Select One...">Select One...</option>
                    <option value="youthSmall">Youth Small</option>
                    <option value="youthMedium">Youth Medium</option>
                    <option value="youthLarge">Youth Large</option>
                    <option value="adultSmall">Adult Small</option>
                    <option value="adultMedium">Adult Medium</option>
                    <option value="adultLarge">Adult Large</option>
                    <option value="adultExtraLarge">Adult Extra Large</option>
                  </Input>
                  {this.renderFieldError(errors, touched, 'shirtSize')}
                </FormGroup>
              </Col>
            </Row>

            <Row form>
              <Col md={12}>
                <FormGroup>
                  <Label for="allergies">Allergies/Health Concerns?</Label>
                  <Input 
                    type="textarea"
                    name="allergies"
                    value={values.allergies}
                    onChange={handleChange}
                    invalid={errors.allergies && touched.allergies}
                  />
                  {this.renderFieldError(errors, touched, 'allergies')}
                </FormGroup>
              </Col>
            </Row>

            <div className="border border-secondary rounded px-2">
              <h6 className="mt-2">Parent/Guardian 1:</h6>

              <Row form>
                <Col md={4}>
                  <FormGroup>
                    <Label for="parentOneFirstName">First Name</Label>
                    <Input 
                      type="text"
                      name="parentOneFirstName"
                      value={values.parentOneFirstName}
                      onChange={handleChange}
                      invalid={errors.parentOneFirstName && touched.parentOneFirstName}
                    />
                    {this.renderFieldError(errors, touched, 'parentOneFirstName')}
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="parentOneLastName">Last Name</Label>
                    <Input 
                      type="text"
                      name="parentOneLastName"
                      value={values.parentOneLastName}
                      onChange={handleChange}
                      invalid={errors.parentOneLastName && touched.parentOneLastName}
                    />
                    {this.renderFieldError(errors, touched, 'parentOneLastName')}
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="parentOnePhoneNumber">Phone Number</Label>
                    <Input 
                      type="text"
                      name="parentOnePhoneNumber"
                      value={values.parentOnePhoneNumber}
                      onChange={handleChange}
                      invalid={errors.parentOnePhoneNumber && touched.parentOnePhoneNumber}
                    />
                    {this.renderFieldError(errors, touched, 'parentOnePhoneNumber')}
                  </FormGroup>
                </Col>
              </Row>
              
              <Row form>
                <Col md={8}>
                  <FormGroup>
                    <Label for="parentOneEmail">Email</Label>
                    <Input 
                      type="text"
                      name="parentOneEmail"
                      value={values.parentOneEmail}
                      onChange={handleChange}
                      invalid={errors.parentOneEmail && touched.parentOneEmail}
                    />
                    {this.renderFieldError(errors, touched, 'parentOneEmail')}
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label>May we text you?</Label>
                    <Row>
                      <Col sm={{ size: 3, offset: 2}}>               
                        <Label check>
                          <Input 
                            type="radio"
                            checked={values.parentOneCanContact} 
                            onChange={() => setFieldValue('parentOneCanContact', !values.parentOneCanContact)} 
                          />
                            Yes
                        </Label>
                      </Col>
                      <Col sm={6}>                      
                        <Label check>
                          <Input 
                            type="radio"
                            checked={!values.parentOneCanContact}
                            onChange={() => setFieldValue('parentOneCanContact', !values.parentOneCanContact)}
                          />
                          No
                        </Label>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
              </Row>
            </div>

            <div className="border border-secondary rounded px-2 my-3">
              <h6 className="mt-2">Parent/Guardian 2:</h6>

              <Row form>
                <Col md={4}>
                  <FormGroup>
                    <Label for="parentTwoFirstName">First Name</Label>
                    <Input 
                      type="text"
                      name="parentTwoFirstName"
                      value={values.parentTwoFirstName}
                      onChange={handleChange}
                      invalid={errors.parentTwoFirstName && touched.parentTwoFirstName}
                    />
                    {this.renderFieldError(errors, touched, 'parentTwoFirstName')}
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="parentTwoLastName">Last Name</Label>
                    <Input 
                      type="text"
                      name="parentTwoLastName"
                      value={values.parentTwoLastName}
                      onChange={handleChange}
                      invalid={errors.parentTwoLastName && touched.parentTwoLastName}
                    />
                    {this.renderFieldError(errors, touched, 'parentTwoLastName')}
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="parentTwoPhoneNumber">Phone Number</Label>
                    <Input 
                      type="text"
                      name="parentTwoPhoneNumber"
                      value={values.parentTwoPhoneNumber}
                      onChange={handleChange}
                      invalid={errors.parentTwoPhoneNumber && touched.parentTwoPhoneNumber}
                    />
                    {this.renderFieldError(errors, touched, 'parentTwoPhoneNumber')}
                  </FormGroup>
                </Col>
              </Row>
              
              <Row form>
                <Col md={8}>
                  <FormGroup>
                    <Label for="parentTwoEmail">Email</Label>
                    <Input 
                      type="text"
                      name="parentTwoEmail"
                      value={values.parentTwoEmail}
                      onChange={handleChange}
                      invalid={errors.parentTwoEmail && touched.parentTwoEmail}
                    />
                    {this.renderFieldError(errors, touched, 'parentTwoEmail')}
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label>May we text you?</Label>
                    <Row>
                      <Col sm={{ size: 3, offset: 2}}>                      
                        <Label check>
                          <Input 
                            type="radio"
                            checked={values.parentTwoCanContact}
                            onChange={() => setFieldValue('parentTwoCanContact', !values.parentTwoCanContact)}
                          />
                            Yes
                        </Label>
                      </Col>
                      <Col sm={6}>                      
                        <Label check>
                          <Input 
                            type="radio"
                            checked={!values.parentTwoCanContact}
                            onChange={() => setFieldValue('parentTwoCanContact', !values.parentTwoCanContact)}
                          />
                          No
                        </Label>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
              </Row>
            </div>

            <div className="border border-secondary rounded px-2">
              <h6 className="mt-2">Emergency Contact 1</h6>

              <Row form>
                <Col md={4}>
                  <FormGroup>
                    <Label for="emergencyContactOneName">Name</Label>
                    <Input 
                      type="text"
                      name="emergencyContactOneName"
                      value={values.emergencyContactOneName}
                      onChange={handleChange}
                      invalid={errors.emergencyContactOneName && touched.emergencyContactOneName}
                    />
                    {this.renderFieldError(errors, touched, 'emergencyContactOneName')}
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="emergencyContactOneRelationship">Relationship</Label>
                    <Input 
                      type="text"
                      name="emergencyContactOneRelationship"
                      value={values.emergencyContactOneRelationship}
                      onChange={handleChange}
                      invalid={errors.emergencyContactOneRelationship && touched.emergencyContactOneRelationship}
                    />
                    {this.renderFieldError(errors, touched, 'emergencyContactOneRelationship')}
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="emergencyContactOnePhoneNumber">Phone Number</Label>
                    <Input 
                      type="text"
                      name="emergencyContactOnePhoneNumber"
                      value={values.emergencyContactOnePhoneNumber}
                      onChange={handleChange}
                      invalid={errors.emergencyContactOnePhoneNumber && touched.emergencyContactOnePhoneNumber}
                    />
                    {this.renderFieldError(errors, touched, 'emergencyContactOnePhoneNumber')}
                  </FormGroup>
                </Col>
              </Row>
            </div>

            <div className="border border-secondary rounded px-2 my-3">
              <h6 className="mt-2">Emergency Contact 2</h6>

              <Row form>
                <Col md={4}>
                  <FormGroup>
                    <Label for="emergencyContactTwoName">Name</Label>
                    <Input 
                      type="text"
                      name="emergencyContactTwoName"
                      value={values.emergencyContactTwoName}
                      onChange={handleChange}
                      invalid={errors.emergencyContactTwoName && touched.emergencyContactTwoName}
                    />
                    {this.renderFieldError(errors, touched, 'emergencyContactTwoName')}
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="emergencyContactTwoRelationship">Relationship</Label>
                    <Input 
                      type="text"
                      name="emergencyContactTwoRelationship"
                      value={values.emergencyContactTwoRelationship}
                      onChange={handleChange}
                      invalid={errors.emergencyContactTwoRelationship && touched.emergencyContactTwoRelationship}
                    />
                    {this.renderFieldError(errors, touched, 'emergencyContactTwoRelationship')}
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="emergencyContactTwoPhoneNumber">Phone Number</Label>
                    <Input 
                      type="text"
                      name="emergencyContactTwoPhoneNumber"
                      value={values.emergencyContactTwoPhoneNumber}
                      onChange={handleChange}
                      invalid={errors.emergencyContactTwoPhoneNumber && touched.emergencyContactTwoPhoneNumber}
                    />
                    {this.renderFieldError(errors, touched, 'emergencyContactTwoPhoneNumber')}
                  </FormGroup>
                </Col>
              </Row>
            </div>

            <Button className="btn-block my-3" color="primary" type="submit" >Sign Up</Button>
          </Form>
        )}
      </Formik>
    );
  }
}  