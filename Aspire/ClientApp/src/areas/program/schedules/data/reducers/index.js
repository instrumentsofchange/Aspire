import { combineReducers } from 'redux'
import ListReducer from './schedule-list-data-reducer'
import FormReducer from './schedule-form-data-reducer'
import MeetDayReducer from './schedule-meet-day-data-reducer'

export default combineReducers({
  list: ListReducer,
  form: FormReducer,
  meetDay: MeetDayReducer
})