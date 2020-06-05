import React from 'react'
import ContentHeader from './header/ContentHeaderContainer'

export default props => {

  const { showProgramSelector, subNav, children } = props

  return (
    <div id="content-container" className="container-fluid">

      <ContentHeader
        subNav={subNav}
        showProgramSelector={showProgramSelector}
      />

      {children}
    </div>
  )
}