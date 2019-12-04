import { combineReducers } from 'redux';
import schedulesFormReducer from './schedules-form-data-reducer';
import searchSchedulesReducer from './search-schedules-reducer';

export default combineReducers({
  form: schedulesFormReducer,
  search: searchSchedulesReducer
});