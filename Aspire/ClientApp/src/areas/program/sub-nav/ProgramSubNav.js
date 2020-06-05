import React from 'react'
import { NavLink } from 'react-router-dom'
import AccessControl from '../../../appRoot/containers/AccessControlContainer'
import { Roles } from '../../shared/enums/RolesEnum'

export default props => {

  const { path } = props

  return(
    <div className="sub-nav">

      <AccessControl applicationPrivileges={[Roles.admin, Roles.director]}>
        <NavLink 
          to={`${path}/check-in`}
        >
          Check In
        </NavLink>

        <NavLink
          to={`${path}/students`}
        >
          Students
        </NavLink>
      </AccessControl>

      <AccessControl applicationPrivileges={[Roles.admin]}>
        <NavLink
          to={`${path}/schedules`}
        >
          Schedules
        </NavLink>
      </AccessControl>

    </div>
  )
}