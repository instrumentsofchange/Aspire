import { combineReducers } from 'redux'
import ScheduleListUiReducer from './schedule-list-ui-reducer'
import ScheduleFormUiReducer from './schedule-form-ui-reducer'
import ScheduleMeetDayUiReducer from './schedule-meet-day-ui-reducer'

export default combineReducers({
  list: ScheduleListUiReducer,
  form: ScheduleFormUiReducer,
  meetDay: ScheduleMeetDayUiReducer
})