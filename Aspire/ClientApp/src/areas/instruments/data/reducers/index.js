import { combineReducers } from 'redux'
import listReducer from './instrument-data-reducer'
import formReducer from './instrument-form-data-reducer'

export default combineReducers({
  list: listReducer,
  form: formReducer
})