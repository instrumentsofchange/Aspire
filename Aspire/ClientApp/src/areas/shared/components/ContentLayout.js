import React from 'react'
import '../../../styles/content-layout.scss'

export default props => {

  const { subNav, children } = props

  return (
    <div className="container-fluid">
      <div className="content-header">
        <div className="sub-nav-container">
          {subNav}
        </div>
      </div>
      {children}
    </div>
  )
}