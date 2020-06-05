import { combineReducers } from 'redux'
import ContactInfoReducer from './student-contact-info-ui-reducer'
import AttendanceReportReducer from './student-attendance-report-ui-reducer'

export default combineReducers({
  contactInfo: ContactInfoReducer,
  attendanceReport: AttendanceReportReducer
})