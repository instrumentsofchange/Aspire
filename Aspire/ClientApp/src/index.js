//CSS
import 'bootstrap/dist/css/bootstrap.css';

//3rd Party Libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';

//Reducers
import appReducer from './appRoot/app-ui-reducer';
import userReducer from './areas/users/reducers/user-reducer';
import instrumentsReducer from './areas/instruments/reducers/instruments-reducer';

//Aspire Imports
import AspireAppContainer from './appRoot/containers/AspireAppContainer';
import { initializeApp } from './appRoot/AppActions';
import { getProfile } from './areas/users/actions/authentication-actions';

document.addEventListener('DOMContentLoaded', () => {

  const middleware = composeWithDevTools(applyMiddleware(thunk));

  const store = createStore(
    combineReducers({
      app: appReducer,
      users: userReducer,
      instruments: instrumentsReducer
    }), middleware);

  store.dispatch(initializeApp());
  store.dispatch(getProfile());

  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter basename="/">
        <AspireAppContainer />
      </BrowserRouter>
    </Provider>,
    document.getElementById('root')
  );
});