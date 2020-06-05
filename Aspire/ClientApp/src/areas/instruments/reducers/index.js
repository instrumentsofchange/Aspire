import { combineReducers } from 'redux'
import InstrumentsDataReducer from '../data/reducers/index'
import InstrumentsUiReducer from '../ui/reducers/instrument-ui-reducer'

export default combineReducers({
    data: InstrumentsDataReducer,
    ui: InstrumentsUiReducer
});