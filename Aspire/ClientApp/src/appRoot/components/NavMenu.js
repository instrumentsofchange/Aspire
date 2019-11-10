import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Roles } from '../../areas/shared/enums/RolesEnum';

export default class NavMenu extends Component {

    render() {
        const { user, logout } = this.props;
        
        return(
            <Navbar color="light" light expand="md">
                <NavbarBrand href="/">Aspire</NavbarBrand>
                <Nav className="ml-auto" navbar>
                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret>
                            Instruments
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem>
                                <Link to="/instruments/create">Create</Link>
                            </DropdownItem>
                            <DropdownItem>
                                <Link to="/instruments/search">Search</Link>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    <UncontrolledDropdown nav inNavbar className="mr-5">
                        <DropdownToggle nav caret>
                            {user.username}
                        </DropdownToggle>
                        <DropdownMenu>
                            {
                                user.role == Roles.admin &&
                                <DropdownItem>
                                    <Link to="/user/create">Create User</Link>
                                </DropdownItem>
                            }
                            <DropdownItem>
                                <Link to="/user/profile">My Profile</Link>
                            </DropdownItem>
                            <DropdownItem onClick={logout}>
                                Logout
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </Nav>
            </Navbar>
        );
    }
}