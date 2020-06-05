import React from 'react'
import SinglePanelLayout from '../shared/components/SinglePanelLayout'
import InstrumentList from './ui/containers/InstrumentListContainer'

export default props => {

  return (
    <SinglePanelLayout 
      title="Instruments"
      content={<InstrumentList />}
    />
  )
}