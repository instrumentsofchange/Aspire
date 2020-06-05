import { connect } from 'react-redux'
import { fetchProgramOptions, changeProgramSelection } from '../../../../appRoot/data/actions/app-data-actions'
import { hideSimpleProgramChangeModal } from '../../../../appRoot/data/actions/app-ui-actions'
import SimpleProgramChangeModal from '../components/SimpleProgramChangeModal'

const mapStateToProps = state => {

  const {
    programChangeModalOpen
  } = state.app.ui

  const {
    loadingProgramOptions,
    programOptions,
    loadingProgramOptionsError,
    selectedProgram
  } = state.app.data

  return {
    isOpen: programChangeModalOpen,
    loadingProgramOptions,
    programOptions,
    loadingProgramOptionsError,
    selectedProgram
  }
}

const mapDispatchToProps = dispatch => ({
  fetchProgramOptions: () => dispatch(fetchProgramOptions()),
  changeProgramSelection: program => {
    dispatch(changeProgramSelection(program))
    dispatch(hideSimpleProgramChangeModal())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SimpleProgramChangeModal)