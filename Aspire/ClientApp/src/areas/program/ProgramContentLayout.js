import React from 'react'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import ContentLayout from '../shared/aspire-layout/content/ContentLayout'
import SinglePanelLayout from '../shared/components/SinglePanelLayout'
import CheckIn from './check-in/containers/CheckInContainer'
import Students from './students/ui/containers/StudentListContainer'
import ScheduleList from './schedules/ui/containers/ScheduleListContainer'
import ProgramSubNav from './sub-nav/ProgramSubNav'
import AccessControl from '../../appRoot/containers/AccessControlContainer'
import { Roles } from '../shared/enums/RolesEnum'

const Program = props => {

  const resolveDefaultPath = path => {
    return `${path}/students`
  }

  const { 
    match: {
      path
    },
    user
  } = props

  const subNav = (
    <ProgramSubNav path={path} />
  )

  return (
    <AccessControl applicationPrivileges={[Roles.admin, Roles.director]}>
      <ContentLayout subNav={subNav} showProgramSelector={user.role === Roles.admin} >

        <Switch>

          <Route 
            exact
            path={path}
            component={() => <Redirect to={resolveDefaultPath(path)} />}
          />

          <Route
            path={`${path}/check-in`}
          >
            <SinglePanelLayout
              title="Check In"
              content={<CheckIn />}
            />
          </Route>

          <Route
            path={`${path}/students`}
          >
            <SinglePanelLayout
              title="Students"
              content={<Students />}
            />
          </Route>

          <Route
            path={`${path}/schedules`}
          >
            <SinglePanelLayout
              title="Schedules"
              content={<ScheduleList />}
            />
          </Route>

          <Route
            component={() => <Redirect to={resolveDefaultPath(path)} />}
          />

        </Switch>

      </ContentLayout>
    </AccessControl>
  )
}

export default withRouter(Program)