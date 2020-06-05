//CSS
import 'bootstrap/dist/css/bootstrap.css'

//3rd Party Libraries
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import { BrowserRouter } from 'react-router-dom'

//Reducers
import appReducer from './appRoot/data/reducers/index'
import userReducer from './areas/users/reducers/user-reducer'
import instrumentsReducer from './areas/instruments/reducers/index'
import schedulesReducer from './areas/program/schedules/reducers'
import signUpReducer from './areas/signUp/reducers/sign-up-reducer'
import checkInReducer from './areas/program/check-in/reducers/check-in-reducer'
import studentsReducer from './areas/program/students/reducers/index'

//Aspire Imports
import AspireAppContainer from './appRoot/containers/AspireAppContainer'
import { initializeApp } from './appRoot/data/actions/app-data-actions'
import { getProfile } from './areas/users/actions/authentication-actions'

document.addEventListener('DOMContentLoaded', () => {

  const middleware = composeWithDevTools(applyMiddleware(thunk));

  const store = createStore(
    combineReducers({
      app: appReducer,
      users: userReducer,
      instruments: instrumentsReducer,
      schedules: schedulesReducer,
      signUp: signUpReducer,
      checkIn: checkInReducer,
      students: studentsReducer
    }), middleware);

  store.dispatch(initializeApp())
  store.dispatch(getProfile())

  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter basename="/" forceRefresh={true}>
        <AspireAppContainer />
      </BrowserRouter>
    </Provider>,
    document.getElementById('aspire-app-container')
  );
});