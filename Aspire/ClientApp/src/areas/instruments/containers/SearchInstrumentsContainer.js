import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { 
    getSearchFormInitialValues,
    searchInstruments
} from '../actions/SearchInstrumentsAction';
import SearchInstruments from '../components/SearchInstruments';

const mapStateToProps = (state) => {
    return state.instruments.search;
}

const mapDispatchToProps = {
    getSearchFormInitialValues,
    searchInstruments
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchInstruments);