import React, { Component } from 'react'
import { Row, Col, Label } from 'reactstrap'
import { AutoSizer, Table, Column } from 'react-virtualized'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons'
import { isNil, findIndex } from 'lodash'
import { AspireConfirmationModal, AspireModal, LoadingSpinner, TableOptionsHeader, AspireSelect, ErrorRow } from '../../../shared/components'
import './styles/instrument-list.scss'
import InstrumentForm from '../containers/InstrumentFormContainer'

export default class InstrumentList extends Component {

  constructor(props) {
    super(props)

    this.state = {
      status: '',
      program: ''
    }
  }

  componentDidMount() {
    this.props.fetchConstants()
    this.props.fetchInstruments(this.state)
  }

  handleFilterChange = ({ target: { name, value }}) => {
    if(name === 'program') {
      value = parseInt(value)
    }

    this.setState(
      {[name]: value},
      () => this.props.fetchInstruments(this.state))
  }

  deleteInstrument = () => {
    const { deleteInstrument, instrumentIdToDelete } = this.props

    deleteInstrument(instrumentIdToDelete, this.state)
  }

  hideDeleteModal = () => {
    const { hideDeleteModal, deletingInstrumentError } = this.props

    hideDeleteModal(deletingInstrumentError, this.state)
  }

  render() {
    const {
      loading,
      error
    } = this.props

    let content

    if(loading) {
      content = (
        <LoadingSpinner />
      )
    } else if(error) {
      content = (
        <ErrorRow error={error} />
      )
    } else {
      content = (
        <div>
          {this.renderFilterOptions()}
          {this.renderInstrumentList()}
          {this.renderDeleteConfirmationModal()}
          {this.renderInstrumentFormModal()}
        </div>
      )
    }

    return content
  }

  renderFilterOptions = () => {
    const {
      constants: {
        statusOptions,
        programOptions
      },
      fetchInstruments
    } = this.props

    return (
      <div className="filter-options-container">
      
        <Row>
          <Col md={3}>
            <Label for="status">Status</Label>
            <AspireSelect 
              simpleValue
              name="status"
              options={statusOptions || []}
              value={this.state.status}
              onChange={value => this.setState({ status: value }, () => fetchInstruments(this.state))}
            />
          </Col>

          <Col md={3}>
            <Label for="program">Program</Label>
            <AspireSelect 
              simpleValue
              name="program"
              options={programOptions || []}
              value={this.state.program}
              onChange={value => this.setState({ program: value }, () => fetchInstruments(this.state))}
            />
          </Col>

        </Row>
      </div>
    )
  }

  renderInstrumentList = () => {
    const {
      loadingInstruments,
      instruments,
      loadingInstrumentsError
    } = this.props

    let content

    if(loadingInstruments) {
      content = <LoadingSpinner />
    } else if(loadingInstrumentsError) {
      content = <ErrorRow error={loadingInstrumentsError} />
    } else {
      content = (
        <AutoSizer>
          {({ height, width }) => (
            <Table
              headerHeight={40}
              height={height}
              width={width}
              rowCount={instruments.length}
              rowHeight={40}
              rowGetter={({ index }) => instruments[index]}
              noRowsRenderer={this.renderNoRows}
            >
              <Column
                label="Program"
                key="program"
                dataKey="program"
                cellRenderer={this.renderProgramCell}
                width={200}
              />
              <Column
                label="Make"
                key="make"
                dataKey="make"
                cellRenderer={this.renderMakeCell}
                width={175}
              />
              <Column
                label="Model"
                key="model"
                dataKey="model"
                cellRenderer={this.renderModelCell}
                width={175}
              />
              <Column
                label="Status"
                key="status"
                dataKey="status"
                cellRenderer={this.renderStatusCell}
                flexGrow={1}
                width={150}
              />
              <Column
                label="Create Intstrument"
                key="actions"
                dataKey="id"
                headerRenderer={this.renderOptionsHeader}
                cellRenderer={this.renderOptionsCell}
                width={250}
              />
            </Table>
          )}
        </AutoSizer>
      )
    }

    return (
      <div className="aspire-table mt-3">
        {content}
      </div>
      )
  }

  renderNoRows = () => (
    <div className="no-rows">No Instruments Found</div>
  )

  renderMakeCell = ({ rowIndex, rowData: { program: { name }, make: { description }}}) => {
    const { instruments } = this.props

    const findIndexOfFirstMakeOccurrence = findIndex(instruments, 
      instrument => instrument.program.name === name && instrument.make.description === description)

    return findIndexOfFirstMakeOccurrence > -1 && findIndexOfFirstMakeOccurrence === rowIndex
      ? <span>{description}</span>
      : ''
  }

  renderModelCell = ({ rowData: { model: { modelNumber}}}) => (
    <span>{modelNumber}</span>
  )

  renderProgramCell = ({ rowIndex, rowData: { program }}) => {
    const { instruments } = this.props

    const indexOfFirstProgramOccurrence = findIndex(instruments, instrument => instrument.program.name === program.name)

    return indexOfFirstProgramOccurrence > -1 && indexOfFirstProgramOccurrence === rowIndex
      ? <span>{program.name}</span>
      : ''
  }

  renderStatusCell = ({ rowData: { status } }) => {
    let className

    if(status === 'Active') {
      className = 'text-success'
    } else if (status === 'Needs Repair') {
      className = 'text-danger'
    } else {
      className = 'text-warning'
    }
   
    return <span className={className}>{status}</span>
  }

  renderOptionsCell = ({ rowData: { id } }) => {
    const {
      showDeleteModal,
      showFormModal
     } = this.props

    return (
      <span className="options-cell">
        <span 
          className="option-icon"
          title="Edit Instrument"
          onClick={() => showFormModal(id)}
        >
          <FontAwesomeIcon icon={faPencilAlt} />
        </span>
        <span
          className="option-icon"
          title="Delete Instrument"
          onClick={() => showDeleteModal(id)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </span>
      </span>
    )
  }

  renderOptionsHeader = () => {
    const { showFormModal } = this.props

    const options = [{
      text: 'Create Instrument',
      icon: <FontAwesomeIcon icon={faPlusCircle} />,
      className: 'add-option',
      onClick: () => showFormModal(null)
    }]

    return <TableOptionsHeader options={options} />
  }

  renderDeleteConfirmationModal = () => {
    const {
      deleteModalOpen,
      deletingInstrument,
      deletingInstrumentError
    } = this.props

    return (
      <AspireConfirmationModal
        title="Delete Instrument?"
        text="This action cannot be undone. Are you sure you want to delete the schedule?"
        onConfirm={this.deleteInstrument}
        onCancel={this.hideDeleteModal}
        isOpen={deleteModalOpen}
        isProcessing={deletingInstrument}
        error={deletingInstrumentError}
      />
    )
  }

  renderInstrumentFormModal = () => {
    const {
      hideFormModal,
      formModalOpen,
      instrumentId
    } = this.props

    return (
      <AspireModal 
        isOpen={formModalOpen}
        onClose={hideFormModal}
        title={`${isNil(instrumentId) ? 'Create' : 'Edit'} Instrument`}
        content={<InstrumentForm filterOptions={this.state} />}
        size={"lg"}
      />
    )
  }
}