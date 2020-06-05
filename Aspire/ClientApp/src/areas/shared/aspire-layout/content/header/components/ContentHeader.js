import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import '../../../../../../styles/content-layout.scss'

export default class ContentHeader extends Component {

  render() {
    const { 
      showProgramSelector,
      showSimpleProgramChangeModal,
      currentProgram,
      subNav
    } = this.props

    return (
      <div className="content-header">
        <div className="content-header-end">
          {
            showProgramSelector &&
            <div className="program-selector">
              <div className="selection-container" onClick={() => showSimpleProgramChangeModal()}>
                <span className="program-name">
                  {currentProgram.name}  
                </span>
                <span className="settings-gear-icon">
                  <FontAwesomeIcon icon={faCog} />
                </span>  
              </div>
            </div>
          }
        </div>
        <div className="sub-nav-container">
          {subNav}
        </div>
        
      </div>
    )
  }
}