import React from 'react'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'

export default props => {

  /*
    onClose
    title
    content
    isOpen
    size
  */
  const {
    isOpen,
    onClose,
    title,
    content,
    size
  } = props

  return (
    <Modal
      isOpen={isOpen}
      toggle={onClose}
      size={size}
    >
      <ModalHeader toggle={onClose} className="text-center">
        {title}
      </ModalHeader>

      <ModalBody>
        {content}
      </ModalBody>

    </Modal>
  )
}