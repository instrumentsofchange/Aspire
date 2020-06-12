export const APP_INITIALIZATION_REQUEST = '@@aspire-app/APP_INITIALIZATION_REQUEST';
export const APP_INITIALIZATION_SUCCESS = '@@aspire-app/APP_INITIALIZATION_SUCCESS';
export const APP_INITIALIZATION_FAILURE = '@@aspire-app/APP_INITIALIZATION_FAILURE';
export const initializeApp = () => dispatch => {
    dispatch({ type: APP_INITIALIZATION_REQUEST });
}