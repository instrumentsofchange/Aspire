import { combineReducers } from 'redux';
import authenticationReducer from './authentication-reducer';
import createUserReducer from './create-user-reducer';
import userProfileReducer from './user-profile-reducer';

export default combineReducers({
    authentication: authenticationReducer,
    create: createUserReducer,
    userProfile: userProfileReducer
});