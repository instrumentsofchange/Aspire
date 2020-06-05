import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faPencilAlt, faTrash, faCalendarDay } from '@fortawesome/free-solid-svg-icons'
import LoadingSpinner from '../../../../shared/components/LoadingSpinner'
import { AutoSizer, Table, Column } from 'react-virtualized'
import TableOptionsHeader from '../../../../shared/components/TableOptionsHeader'
import AspireConfirmationModal from '../../../../shared/components/AspireConfirmationModal'
import ScheduleFormModal from '../containers/ScheduleFormContainer'
import ScheduleMeetDayModal from '../containers/ScheduleMeetDayContainer'

export default class ScheduleList extends Component {

  componentDidMount() {
    const { 
      programId,
      fetchSchedules
    } = this.props

    fetchSchedules(programId)
  }

  componentDidUpdate(prevProps) {
    const {
      programId,
      fetchSchedules
    } = this.props

    if(prevProps.programId !== programId) {
      fetchSchedules(programId)
    }
  }

  render() {
    const {
      pageLoading,
      pageError,
      scheduleFormModalOpen,
      scheduleMeetDayModalOpen,
      programId
    } = this.props

    let content

    if(pageLoading) {
      content = <LoadingSpinner />
    } else if(pageError) {
      content = <h1>Error: {pageError}</h1>
    } else {
      content = (
        <div className="mt-3">
          {this.renderSchedulesTable()}
          
          {scheduleFormModalOpen && <ScheduleFormModal programId={programId} />}
          {scheduleMeetDayModalOpen && <ScheduleMeetDayModal />}
          {this.renderDeleteConfirmationModal()}
        </div>
      )
    }
    return content
  }

  renderSchedulesTable = () => {
    const { schedules } = this.props

    return (
      <div className="aspire-table mt-3">
        <AutoSizer>
          {({ height, width }) => (
            <Table
              headerHeight={40}
              height={height}
              width={width}
              rowCount={schedules.length}
              rowHeight={40}
              rowGetter={({ index }) => schedules[index]}
              noRowsRenderer={this.renderNoRows}
            >
              <Column
                label=""
                key="index"
                dataKey="index"
                cellRenderer={this.renderIdCell}
                width={100}
              />
              <Column
                label="Date Range"
                key="dateRange"
                dataKey="startDate"
                cellRenderer={this.renderDateRangeCell}
                width={400}
              />
              <Column
                label="Status"
                key="status"
                dataKey="isActive"
                cellRenderer={this.renderStatusCell}
                flexGrow={1}
                width={125}
              />
              <Column
                label="Create Schedule"
                key="actions"
                dataKey="id"
                headerRenderer={this.renderOptionsHeader}
                cellRenderer={this.renderOptionsCell}
                width={250}
              />
            </Table>
          )}
        </AutoSizer>
      </div>
    )
  }

  renderNoRows = () => (
    <div className="no-rows">No Schedules Found</div>
  )

  renderIdCell = ({ rowIndex }) => (
    <span>{rowIndex++}</span>
  )

  renderDateRangeCell = ({ rowData: { startDateFormatted, endDateFormatted }}) => (
    <span>{startDateFormatted} - {endDateFormatted}</span>
  )

  renderStatusCell = ({ rowData: { isActive }}) => (
    <span className={`${isActive ? 'text-success' : 'text-danger'}`}>{isActive ? 'Active' : 'Non-Active'}</span>
  )

  renderOptionsHeader = () => {
    const { showFormModal } = this.props

    const options = [{
      text: 'Create Schedule',
      icon: <FontAwesomeIcon icon={faPlusCircle} />,
      className: 'add-option',
      onClick: ()  => showFormModal(0)
    }]

    return (
      <TableOptionsHeader 
        options={options}
      />
    )
  }

  renderOptionsCell = ({ rowData: { id }}) => {
    const { 
      showFormModal,
      showMeetDayModal,
      showDeleteModal
    } = this.props

    return (
      <span className="options-cell">
        <span
          className="option-icon"
          title="Edit Schedule"
          onClick={() => showFormModal(id)}
        >
          <FontAwesomeIcon icon={faPencilAlt} />
        </span>
        <span
          className="option-icon"
          title="Delete Schedule"
          onClick={() => showDeleteModal(id)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </span>
        <span
          className="option-icon"
          title="Edit Single Meet Day"
          onClick={() => showMeetDayModal(id)}
        >
          <FontAwesomeIcon icon={faCalendarDay} />
        </span>
      </span>
    )
  }

  renderDeleteConfirmationModal = () => {
    const { 
      deleteModalOpen,
      hideDeleteModal,
      scheduleIdToDelete,
      deleteSchedule,
      programId,
      deletingSchedule,
      deletingScheduleError 
    } = this.props

    return (
      <AspireConfirmationModal
        title="Delete Schedule?"
        text="This action cannot be undone. Are you sure you want to delete the schedule?"
        onConfirm={() => deleteSchedule(scheduleIdToDelete, programId)}
        onCancel={hideDeleteModal}
        isOpen={deleteModalOpen}
        isProcessing={deletingSchedule}
        error={deletingScheduleError}
      />
    )
  }
}