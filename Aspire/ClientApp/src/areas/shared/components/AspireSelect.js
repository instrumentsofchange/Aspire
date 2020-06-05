import React from 'react'
import Select from 'react-select'

export default (props) => {

  const {
    onChange,
    value,
    name,
    simpleValue,
    options,
    placeholder,
    disabled,
    className
  } = props

  const handleChange = selectedOption => {
    if(simpleValue) {
      onChange(selectedOption.value)
    } else {
      onChange(selectedOption)
    }
  }

  const getValue = () => {
    let result
    if(simpleValue) {
      result = options.filter(opt => opt.value === value)
    } else {
      result = options.filter(opt => opt.value === value.value)
    }

    return result
  }

  return (
    <Select 
      name={name}
      options={options}
      value={getValue()}
      placeholder={placeholder}
      onChange={handleChange}
      isDisabled={disabled}
      className={className}
    />
  )
}