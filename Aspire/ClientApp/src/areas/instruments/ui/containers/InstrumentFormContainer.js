import { connect } from 'react-redux'
import { isNil } from 'lodash'
import InstrumentForm from '../components/InstrumentForm'
import { hideFormModal } from '../actions/instruments-ui-actions'
import { fetchFormConstants, fetchModelOptions, fetchStudentOptions, fetchInstrument, saveInstrument } from '../../data/actions/instrument-form-data-actions'
import { fetchInstrumentList } from '../../data/actions/instrument-data-actions'

const mapStateToProps = state => {

  const {
    instrumentId
  } = state.instruments.ui

  const {
    loadingFormConstants,
    formConstants,
    loadingFormConstantsError,
    loadingModelOptions,
    loadingModelOptionsError,
    loadingStudentOptions,
    loadingStudentOptionsError,
    loadingInstrument,
    instrument,
    loadingInstrumentError,
    savingInstrument,
    savingInstrumentError
  } = state.instruments.data.form

  const loading = loadingFormConstants || loadingInstrument
  const error = loadingFormConstantsError || loadingModelOptionsError || loadingStudentOptionsError || loadingInstrumentError 

  const isCreate = isNil(instrumentId)

  return {
    loading,
    error,
    isCreate,
    instrumentId,
    instrument,
    formConstants,
    loadingModelOptions,
    loadingStudentOptions,
    savingInstrument,
    savingInstrumentError
  }
}

const mapDispatchToProps = (dispatch, { filterOptions }) => ({

  initializeForm: instrumentId => {
    dispatch(fetchFormConstants())
      .catch(error => console.error(error))

    dispatch(fetchInstrument(instrumentId))
      .then(instrument => {
        if(!isNil(instrumentId)) {
          dispatch(fetchModelOptions(instrument.make.id))
        }

        if(!isNil(instrument.program.id)) {
          dispatch(fetchStudentOptions(instrument.program.id))
        }
      })
      .catch(error => console.error(error))
  },

  fetchModelOptions: makeId => {
    dispatch(fetchModelOptions(makeId))
      .catch(error => console.error(error))
  },

  fetchStudentOptions: programId => dispatch(fetchStudentOptions(programId)),

  saveInstrument: values => {
    dispatch(saveInstrument(values))
      .then(() =>{
        dispatch(hideFormModal())
        dispatch(fetchInstrumentList(filterOptions))
      })
      .catch(error => console.error(error))
  },

  onClose: () => dispatch(hideFormModal())

})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InstrumentForm)