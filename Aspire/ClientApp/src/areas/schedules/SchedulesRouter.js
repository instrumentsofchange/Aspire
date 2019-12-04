import React from 'react';
import { Switch, Route } from 'react-router-dom';
import AccessControlContainer from '../../appRoot/containers/AccessControlContainer';
import { Roles } from '../shared/enums/RolesEnum';
import ScheduleForm from './containers/ScheduleFormContainer';
import SearchSchedules from './containers/SearchSchedulesContainer';

export default props => {
  return (
    <Switch>

      <Route exact path="/schedules/create">
        <AccessControlContainer applicationPrivileges={[Roles.admin]}>
          <ScheduleForm />
        </AccessControlContainer>
      </Route>

      <Route 
        path="/schedules/edit/:scheduleId" 
        render={props => <ScheduleForm scheduleId={props.match.params.scheduleId} />} 
      />

      <Route exact path="/schedules/search">
        <AccessControlContainer applicationPrivileges={[Roles.admin]}>
          <SearchSchedules />
        </AccessControlContainer>
      </Route>

    </Switch>
  );
}