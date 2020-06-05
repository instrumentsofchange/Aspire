import { combineReducers } from 'redux'
import appDataReducer from './app-data-reducer'
import appUiReducer from './app-ui-reducer'

export default combineReducers({
  data: appDataReducer,
  ui: appUiReducer
})