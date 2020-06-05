import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { Alert } from 'reactstrap'

export default ({ error, className }) => {

  return (
    <Alert className={className} color="danger">
      <span style={{ 'marginRight': '5px' }}>
        <FontAwesomeIcon icon={faExclamationCircle} />
      </span>
      
      {error}
    </Alert>
  )
}