import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDrum, faChalkboardTeacher, faUser } from '@fortawesome/free-solid-svg-icons'
import { Roles } from '../../areas/shared/enums/RolesEnum';
import '../../styles/nav-bar.scss'

export default class NavMenu extends Component {

	render() {
		const { user, logout } = this.props;

		return (
			<Navbar expand="md" >
				<NavbarBrand href="/">Aspire</NavbarBrand>
				<Nav className="ml-auto" navbar>

					{
						user.role === Roles.admin &&
						<Link to="/instruments" className="nav-link">
							<FontAwesomeIcon className="mr-2" icon={faDrum} color="white" />
							Instruments
						</Link>
					}

					<Link to="/program" className="nav-link">
						<FontAwesomeIcon className="mr-2" icon={faChalkboardTeacher} color="white" />
						Programs
					</Link>

					<UncontrolledDropdown nav inNavbar className="mr-5">

						<DropdownToggle nav caret>
							<FontAwesomeIcon className="mr-2" icon={faUser} color="white" />
							{user.username}
						</DropdownToggle>

						<DropdownMenu>
							<Link to="/user/profile">
								<DropdownItem>
									My Profile
                </DropdownItem>
							</Link>
							{
								user.role === Roles.admin &&
								<Link to="/user/create">
									<DropdownItem>
										Create User
                  </DropdownItem>
								</Link>
							}
							<DropdownItem onClick={logout}>
								Logout
              </DropdownItem>
						</DropdownMenu>
					</UncontrolledDropdown>
				</Nav>
			</Navbar>
		)
	}
}