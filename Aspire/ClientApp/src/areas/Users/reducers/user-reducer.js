import { combineReducers } from 'redux';
import authenticationReducer from './authentication-reducer';
import createUserReducer from './create-user-reducer';

export default combineReducers({
    authentication: authenticationReducer,
    create: createUserReducer
});