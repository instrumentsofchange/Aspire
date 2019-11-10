import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import AccessControlContainer from '../../appRoot/containers/AccessControlContainer';
import { Roles } from '../shared/enums/RolesEnum';
import CreateUserContainer from './containers/CreateUserContainer';
import UserProfileContainer from './containers/UserProfileContainer';

const UserRouter = () => {
    return(
        <Switch>

            <Route exact path="/user/create">
                <AccessControlContainer applicationPrivileges={[Roles.admin]}>
                    <CreateUserContainer />
                </AccessControlContainer>
            </Route>

            <Route exact path="/user/profile">
                <UserProfileContainer />
            </Route>

        </Switch>
    );
}

export default UserRouter;