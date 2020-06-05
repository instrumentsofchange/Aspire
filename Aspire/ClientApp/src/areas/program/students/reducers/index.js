import { combineReducers } from 'redux'
import StudentsDataReducer from '../data/reducers/index'
import StudentsUiReducer from '../ui/reducers'

export default combineReducers({
  data: StudentsDataReducer,
  ui: StudentsUiReducer
})