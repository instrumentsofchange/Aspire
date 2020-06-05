import { connect } from 'react-redux'
import { isNil } from 'lodash'
import { fetchInstrumentConstants, fetchInstrumentList, deleteInstrument } from '../../data/actions/instrument-data-actions'
import { showDeleteModal, hideDeleteModal, showFormModal, hideFormModal } from '../actions/instruments-ui-actions'
import InstrumentList from '../components/InstrumentList'

const mapStateToProps = state => {

  const {
    loadingConstants,
    constants,
    loadingConstantsError,
    loadingInstruments,
    instruments,
    loadingInstrumentsError,
    deletingInstrument,
    deletingInstrumentError
  } = state.instruments.data.list

  const {
    deleteModalOpen,
    instrumentIdToDelete,
    formModalOpen, 
    instrumentId
  } = state.instruments.ui

  const loading = loadingConstants

  const error = loadingConstantsError

  return {
    loading,
    error,
    constants,
    loadingInstruments,
    instruments,
    loadingInstrumentsError,
    deleteModalOpen,
    instrumentIdToDelete,
    deletingInstrument,
    deletingInstrumentError,
    formModalOpen,
    instrumentId
  }
}

const mapDispatchToProps = dispatch => ({

  fetchConstants: () => dispatch(fetchInstrumentConstants()),

  fetchInstruments: filterOptions => dispatch(fetchInstrumentList(filterOptions)),

  deleteInstrument: (instrumentId, filterOptions) => {
    dispatch(deleteInstrument(instrumentId))
      .then(() => {
        dispatch(hideDeleteModal())
        dispatch(fetchInstrumentList(filterOptions))
      })
      .catch(error => console.log(error))
  },

  showDeleteModal: instrumentId => dispatch(showDeleteModal(instrumentId)),

  hideDeleteModal: (deletingError, filterOptions) => {
    dispatch(hideDeleteModal())
    
    if (!isNil(deletingError)) {
      dispatch(fetchInstrumentList(filterOptions))
    }
  },

  showFormModal: instrumentId => dispatch(showFormModal(instrumentId)),

  hideFormModal: () => dispatch(hideFormModal())

})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InstrumentList)