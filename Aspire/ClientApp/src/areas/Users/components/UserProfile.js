import React, { Component } from 'react'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { Alert, Form, Button, Row, Col, FormGroup, Label, Input, FormFeedback } from 'reactstrap'
import LoadingSpinner from '../../shared/components/LoadingSpinner'
import LoginInfoModal from './LoginInfoModal'
import States from '../../shared/formHelpers/states'
import { ErrorRow } from '../../shared/components'

const getMaxErrorMessage = (propertyName, maxLength, type) => {
	return `${propertyName} can be a max of ${maxLength} ${type === 'string' ? 'characters' : 'numbers'}`
}

const userSchema = Yup.object().shape({
	firstName: Yup.string().required('Required').max(50, getMaxErrorMessage('First Name', 50, 'string')),
	lastName: Yup.string().required('Required').max(50, getMaxErrorMessage('Last Name', 50, 'string')),
	email: Yup.string().required('Required').email().max(50, getMaxErrorMessage('Email', 50, 'string')),
	program: Yup.string().nullable(),
	role: Yup.string().required('Required'),
	address: Yup.object().shape({
		addressOne: Yup.string().required('Required').max(50, getMaxErrorMessage('Address One', 50, 'string')),
		addressTwo: Yup.string().max(50, getMaxErrorMessage('Address Two', 50, 'string')),
		city: Yup.string().required('Required').max(50, getMaxErrorMessage('City', 50, 'string')),
		state: Yup.string().required('Required').max(2, getMaxErrorMessage('State', 2, 'string')),
		zipCode: Yup.string().required('Required').length(5, 'Zip Code must be exactly 5 numbers').matches(/^[0-9]{5}/, 'Zip Code must be 5 positive numbers')
	})
})

export default class UserProfile extends Component {

	constructor(props) {
		super(props)

		this.state = {
			loginInfoModalOpen: false
		}
	}

	componentDidMount() {
		this.props.fetchUserProfile()
	}

	componentDidUpdate(prevProps) {
		if (prevProps.savingLoginInfoError !== this.props.savingLoginInfoError
			&& this.props.savingLoginInfoError === null) {
			this.toggleLoginInfoModal()
		}
	}

	toggleLoginInfoModal = () => {
		this.setState({
			loginInfoModalOpen: !this.state.loginInfoModalOpen
		})
	}

	addressOneInvalid = (errors, touched) =>
		errors.address && errors.address.addressOne && touched.address && touched.address.addressOne

	addressTwoInvalid = (errors, touched) =>
		errors.address && errors.address.addressTwo && touched.address && touched.address.addressTwo

	cityInvalid = (errors, touched) =>
		errors.address && errors.address.city && touched.address && touched.address.city

	stateInvalid = (errors, touched) =>
		errors.address && errors.address.state && touched.address && touched.address.state

	zipCodeInvalid = (errors, touched) =>
		errors.address && errors.address.zipCode && touched.address && touched.address.zipCode

	render() {
		const {
			saveLoginInfo,
			savingLoginInfoError,
			user,
			removeLoginInfoError
		} = this.props

		const { loginInfoModalOpen } = this.state

		if (savingLoginInfoError && !loginInfoModalOpen) {
			this.toggleLoginInfoModal()
		}

		return (
			<div>

				{this.renderContent()}

				<LoginInfoModal
					isOpen={this.state.loginInfoModalOpen}
					toggle={this.toggleLoginInfoModal}
					removeLoginInfoError={removeLoginInfoError}
					saveLoginInfo={saveLoginInfo}
					error={savingLoginInfoError}
					username={user && user.username}
				/>

			</div>
		)
	}

	renderContent = () => {
		const {
			pageLoading,
			pageLoadingError,
			savingProfile,
			userSaved,
			savingLoginInfo,
			loginInfoSaved
		} = this.props

		const {
			loginInfoModalOpen
		} = this.state

		let content

		if (pageLoading) {
			content = <LoadingSpinner />
		} else if (pageLoadingError) {
			content = <Alert color="danger">{pageLoadingError}</Alert>
		} else if (savingProfile) {
			content = <LoadingSpinner text="Saving..." />
		} 
		// else if (userSaved || loginInfoSaved) {
		// 	setTimeout(() => {
		// 		this.setState({
		// 			redirect: true
		// 		})
		// 	}, 2000)

		// 	content = <LoadingSpinner color="success" text="Success!" />
		// } 
		else if (savingLoginInfo) {
			if (loginInfoModalOpen) {
				this.toggleLoginInfoModal()
			}

			content = <LoadingSpinner text="Saving" />
		} else {
			content = this.renderForm()
		}

		return content
	}

	renderForm = () => {
		const {
			user,
			saveProfile,
			savingProfileError
		} = this.props

		return (
			<div>

				{
					savingProfileError &&
					<ErrorRow error={savingProfileError} />
				}

				<Formik
					enableReinitialize={false}
					initialValues={user}
					validationSchema={userSchema}
					onSubmit={values => {
						saveProfile(values)
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

									<Col md={2}>
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

									<Col md={2}>
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

									<Col className="text-right" md={{ size: 2, offset: 6 }}>
										<Button color="secondary" onClick={this.toggleLoginInfoModal}>Change Login Info</Button>
									</Col>

								</Row>

								<Row form>
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

									<Col md={4}>
										<FormGroup>
											<Label for="address.addressOne">Address One</Label>
											<Input
												type="text"
												name="address.addressOne"
												onChange={handleChange}
												value={values.address.addressOne}
												invalid={this.addressOneInvalid(errors, touched)}
											/>
											{
												this.addressOneInvalid(errors, touched)
													? <FormFeedback>{errors.address.addressOne}</FormFeedback>
													: null
											}
										</FormGroup>
									</Col>

								</Row>

								<Row form>
									<Col md={4}>
										<FormGroup>
											<Label for="address.addressTwo">Adress Two</Label>
											<Input
												type="text"
												name="address.addressTwo"
												onChange={handleChange}
												value={values.address.addressTwo}
												invalid={this.addressTwoInvalid(errors, touched)}
											/>
											{
												this.addressTwoInvalid(errors, touched)
													? <FormFeedback>{errors.address.addressTwo}</FormFeedback>
													: null
											}
										</FormGroup>
									</Col>
								</Row>

								<Row form>

									<Col md={2}>
										<FormGroup>
											<Label for="address.city">City</Label>
											<Input
												type="text"
												name="address.city"
												onChange={handleChange}
												value={values.address.city}
												invalid={this.cityInvalid(errors, touched)}
											/>
											{
												this.cityInvalid(errors, touched)
													? <FormFeedback>{errors.address.city}</FormFeedback>
													: null
											}
										</FormGroup>
									</Col>

									<Col md={1}>
										<FormGroup>
											<Label for="address.state">State</Label>
											<Input
												type="select"
												name="address.state"
												onChange={handleChange}
												invalid={this.stateInvalid(errors, touched)}
												value={values.address.state}
											>
												{this.getStateOptions()}
											</Input>
											{
												this.stateInvalid(errors, touched)
													? <FormFeedback>{errors.address.state}</FormFeedback>
													: null
											}
										</FormGroup>
									</Col>

									<Col md={1}>
										<FormGroup>
											<Label for="address.zipCode">Zip Code</Label>
											<Input
												type="text"
												name="address.zipCode"
												onChange={handleChange}
												value={values.address.zipCode}
												invalid={this.zipCodeInvalid(errors, touched)}
											/>
											{
												this.zipCodeInvalid(errors, touched)
													? <FormFeedback>{errors.address.zipCode}</FormFeedback>
													: null
											}
										</FormGroup>
									</Col>

								</Row>

								<Row form>

									<Col sm={12} md={{ size: 2, offset: 1 }}>
										<Button className="btn-block" color="primary" type="submit">Save</Button>
									</Col>

								</Row>

							</Form>
						)}
				/>

			</div>
		)
	}

	renderError = () => {
		return <h1>Error</h1>
	}

	getStateOptions = () => {
		return States.map(state => (
			<option key={state.abbreviation} value={state.abbreviation}>{state.name}</option>
		))
	}
}