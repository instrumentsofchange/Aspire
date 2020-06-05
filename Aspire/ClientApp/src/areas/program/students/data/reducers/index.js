import { combineReducers } from 'redux'
import StudentListReducer from './student-list-data-reducer'
import StudentInfoReducer from './student-contact-info-data-reducer'

export default combineReducers({
  list: StudentListReducer,
  info: StudentInfoReducer
})