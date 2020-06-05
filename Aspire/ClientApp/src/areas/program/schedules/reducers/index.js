import { combineReducers } from 'redux'
import ScheduleDataReducer from '../data/reducers'
import ScheduleUiReducer from '../ui/reducers'

export default combineReducers({
  data: ScheduleDataReducer,
  ui: ScheduleUiReducer
})