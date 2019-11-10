import React from 'react';
import { Switch, Route } from 'react-router-dom';
import AccessControlContainer from '../../appRoot/containers/AccessControlContainer';
import CreateEditInstrumentContainer from './containers/CreateEditInstrumentContainer';
import { Roles } from '../shared/enums/RolesEnum';
import SearchInstrumentsContainer from './containers/SearchInstrumentsContainer';

const InstrumentRouter = () => {
    return(
        <Switch>
            <Route exact path="/instruments/create">
                <AccessControlContainer applicationPrivileges={[Roles.admin]}>
                    <CreateEditInstrumentContainer isCreate={true} />
                </AccessControlContainer>
            </Route>

            <Route 
                path="/instruments/edit/:instrumentId" 
                component={CreateEditInstrumentContainer}
            />
                
            <Route path="/instruments/search">
                <AccessControlContainer applicationPrivileges={[Roles.admin, Roles.director]}>
                    <SearchInstrumentsContainer />
                </AccessControlContainer>
            </Route>
        </Switch>
    );
}

export default InstrumentRouter;