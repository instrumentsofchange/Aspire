//3rd Party Libraries
import React, { Component } from 'react'
import { Switch, Route, withRouter, BrowserRouter, Redirect } from 'react-router-dom'

import '../../styles/main.scss'


import AuthenticationAppContainer from '../../areas/users/containers/AuthenticationAppContainer'
import NavMenu from './NavMenu';
import IocLogoWhiteBg from '../../assets/IOCLogo-WhiteBG.png'

//Routers
import UserRouter from '../../areas/users/UserRouter'

//Components
import SignUpForm from '../../areas/signUp/containers/SignUpFormContainer'
import LoadingSpinner from '../../areas/shared/components/LoadingSpinner'
import Program from '../../areas/program/ProgramContentLayout'
import SimpleProgramChangeModal from '../../areas/program/ui/containers/SimpleProgramChangeModalContainer'
import Instruments from '../../areas/instruments/InstrumentLayout'
import { SinglePanelLayout } from '../../areas/shared/components'

const App = (props) => {
	const { initializing, user } = props

	let content;

	if (initializing) {
		content = <LoadingSpinner />
	} else if (user.isAuthenticated) {
		content = renderAuthenticatedApp(props)
	} else {
		content = <AuthenticationAppContainer />
	}

	return (
		<Switch>
			<Route exact path="/student/sign-up">
				<SignUpForm />
			</Route>

			<Route path="/">
				{content}
			</Route>
		</Switch>
	);
}

const renderAuthenticatedApp = (props) => {
	const {
		user,
		logoutUser
	} = props

	const program = withRouter(Program)

	return (
		<BrowserRouter
			forceRefresh={false}
			basename="/"
		>
			<div>
				<NavMenu user={user} logout={logoutUser} />

				<div className="aspire-body">
					<Switch>
						<Route path="/user">
							<UserRouter />
						</Route>

						<Route path="/instruments">
							<Instruments />
						</Route>

						<Route path="/program" >
							<Program user={user} /> 
						</Route>

						<Route path="/">
							<Redirect to="/instruments" />
							{/* <div className="col-md-8 offset-md-2 text-center mt-3">
								<img src={IocLogoWhiteBg} />
							</div> */}
						</Route>
					</Switch>

					<SimpleProgramChangeModal />

				</div>
			</div>
		</BrowserRouter>
	)
}

export default App;