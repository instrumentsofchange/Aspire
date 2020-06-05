import { connect } from 'react-redux'
import ContentHeader from './components/ContentHeader'
import { showSimpleProgramChangeModal, hideSimpleProgramChangeModal } from '../../../../../appRoot/data/actions/app-ui-actions'

const mapStateToProps = (state, props) => {

  return {
    currentProgram: state.app.data.selectedProgram,
    showProgramSelector: props.showProgramSelector
  }
}

const mapDispatchToProps = {
  showSimpleProgramChangeModal,
  hideSimpleProgramChangeModal
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentHeader)