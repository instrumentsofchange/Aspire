import { connect } from 'react-redux';
import { 
    getInitialInstrumentFormOptions,
    getModelOptions,
    getStudentOptions,
    getInstrumentToEdit,
    saveInstrument
 } from '../actions/CreateEditInstrumentActions';
import CreateEditInstrument from '../components/CreateEditInstrument';

const mapStateToProps = (state, props) => {
    let instrumentId = 0;

    if(props.match) {
        instrumentId = props.match.params.instrumentId;
    }

    return {
        ...state.instruments.createEdit,
        isCreate: props.isCreate !== undefined,
        instrumentId: instrumentId
    }
}

const mapDispatchToProps = {
    getInitialInstrumentFormOptions,
    getModelOptions,
    getStudentOptions,
    getInstrumentToEdit,
    saveInstrument
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateEditInstrument)