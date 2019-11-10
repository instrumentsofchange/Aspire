import { combineReducers } from 'redux';
import CreateEditInstrumentReducer from './create-edit-instrument-reducer';
import SearchInstrumentsReducer from './search-instruments-reducer';

export default combineReducers({
    createEdit: CreateEditInstrumentReducer,
    search: SearchInstrumentsReducer
});