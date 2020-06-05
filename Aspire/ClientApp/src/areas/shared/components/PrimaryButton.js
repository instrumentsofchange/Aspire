import React from 'react'
import '../../../styles/button.scss'

export default props => {

  const { 
    type, 
    text,
    onClick,
    icon,
    className,
    disabled
  } = props

  return (
    <button className={`button-primary ${className}`} type={type} onClick={onClick} disabled={disabled}>

      {icon &&
        <span className="button-icon">{icon}</span>
      }

      <span className="button-text">{text}</span>
    </button>
  )
}