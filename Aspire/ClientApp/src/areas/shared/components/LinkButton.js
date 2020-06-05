import React from 'react'
import { isNil } from 'lodash'
import './styles/link-button.scss'

export default ({ text, onClick, className }) => {

  return (
    <button className={`button-link ${isNil(className) ? '' : className}`} onClick={onClick}>
      <span className="button-text">{text}</span>
    </button>
  )
}