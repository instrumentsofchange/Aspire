import React from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import { isNil } from 'lodash'
import ErrorRow from './ErrorRow'
import LoadingSpinner from './LoadingSpinner'
import PrimaryButton from './PrimaryButton'
import '../../../styles/button.scss'

export default props => {
  const {
    title,
    text,
    onConfirm,
    onCancel,
    isOpen,
    isProcessing,
    error
  } = props

  return (
    <Modal 
      isOpen={isOpen}
      toggle={onCancel}
    >
      <ModalHeader>
        {title}
      </ModalHeader>

      <ModalBody>
        {isNil(error) ? text : <ErrorRow error={error} />}
      </ModalBody>

      <ModalFooter>
        {
          isProcessing 
            ? <LoadingSpinner size={50} />
            : <div>
              {isNil(error) && <PrimaryButton className="mr-2" onClick={onConfirm} text="Confirm" />}
              <span className="button-link" onClick={onCancel}>
                Cancel
              </span>
            </div>
        }
      </ModalFooter>
    </Modal>
  )
}